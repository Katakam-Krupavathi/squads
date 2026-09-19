import json
import boto3
from typing import Dict, Any, Optional
from ..core.config import settings
from ..api.schemas import IssueCandidate, GroundedWalkthrough

class BedrockAgent:
    """
    Amazon Bedrock AI Agent for synthesizing evidence-grounded walkthroughs
    and explaining deterministic difficulty scores.
    """
    def __init__(self):
        self.model_id = settings.BEDROCK_MODEL_ID
        self.region = settings.AWS_REGION
        self.client = None
        try:
            self.client = boto3.client("bedrock-runtime", region_name=self.region)
        except Exception:
            self.client = None

    def refine_walkthrough_explanation(
        self,
        walkthrough: GroundedWalkthrough,
        issue: IssueCandidate
    ) -> GroundedWalkthrough:
        """
        Uses Amazon Bedrock (Claude 3.5 Sonnet / Llama 3) to generate high-clarity
        beginner explanations using strictly verified evidence and file paths.
        """
        if not self.client:
            return walkthrough

        try:
            prompt = (
                f"You are FirstPR AI Contributor Assistant. Explain this issue for a first-time contributor.\n"
                f"Issue Title: {issue.title}\n"
                f"Issue Body: {issue.body}\n"
                f"Difficulty Score: {issue.difficulty.total_score}/100 ({issue.difficulty.category.value})\n"
                f"Evidence: {[s.evidence for s in issue.difficulty.signals.values()]}\n"
                f"Verified Files: {[f.path for f in walkthrough.files_to_read]}\n\n"
                f"Rules:\n"
                f"1. DO NOT invent any file path not in the Verified Files list.\n"
                f"2. Keep the explanation encouraging and crystal clear for a beginner.\n"
                f"Provide a 2-paragraph summary explaining the bug and how to fix it."
            )

            # Invoke Bedrock Claude model format
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 500,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            })

            response = self.client.invoke_model(
                modelId=self.model_id,
                body=body
            )
            response_body = json.loads(response["body"].read())
            ai_text = response_body.get("content", [{}])[0].get("text", "")
            if ai_text:
                walkthrough.simple_explanation = ai_text.strip()
                walkthrough.model_provider = "Amazon Bedrock (Claude 3.5 Sonnet) + Grounding Verifier"
        except Exception:
            # Fallback cleanly if Bedrock API call fails or no AWS credentials
            pass

        return walkthrough
