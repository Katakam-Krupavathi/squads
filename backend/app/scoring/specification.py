import re
from typing import Dict, Any
from ..api.schemas import DifficultySignal
from ..core.config import settings

def calculate_specification_quality(
    issue_title: str,
    issue_body: str
) -> DifficultySignal:
    """
    Signal 5: Specification Quality.
    Evaluates issue description clarity, steps to reproduce, stack traces, and criteria.
    High specification quality reduces beginner confusion (lowers score).
    """
    weight = settings.SIGNAL_WEIGHTS["specification_quality"]
    evidence = []
    
    body = (issue_body or "").strip()
    title = issue_title.strip()
    combined = f"{title}\n{body}"
    
    spec_points = 0
    
    # 1. Check description length
    if len(body) > 300:
        spec_points += 20
        evidence.append("Detailed description with contextual background.")
    elif len(body) > 100:
        spec_points += 10
    else:
        evidence.append("Short / minimal issue description.")

    # 2. Reproduction steps & behavior
    if re.search(r"(steps to reproduce|reproduction|how to reproduce|expected behavior|actual behavior)", combined, re.I):
        spec_points += 25
        evidence.append("Structured reproduction steps or expected vs actual behavior defined.")
        
    # 3. Stack traces or error logs
    if "```" in body or re.search(r"(error:|traceback|exception:|at line)", body, re.I):
        spec_points += 20
        evidence.append("Concrete error logs or code snippet provided.")
        
    # 4. Explicit file or symbol references
    if "`" in body or "/" in body:
        spec_points += 20
        evidence.append("Explicit file paths or code symbols cited.")
        
    # 5. Acceptance criteria / checklist
    if "- [ ]" in body or "- [x]" in body or "acceptance criteria" in combined.lower():
        spec_points += 15
        evidence.append("Clear task checklist or acceptance criteria defined.")

    # Score inverted: 100 points of spec -> 15 difficulty. 0 spec -> 85 difficulty.
    raw_score = max(15.0, min(90.0, 95.0 - spec_points * 0.8))
    score = round(raw_score, 1)
    weighted = round(score * weight, 2)
    
    explanation = f"Specification is {'thoroughly documented' if score < 40 else 'moderately defined' if score < 70 else 'vague or underspecified'}."

    return DifficultySignal(
        name="Specification Quality",
        score=score,
        weight=weight,
        weighted_score=weighted,
        evidence=evidence,
        explanation=explanation
    )
