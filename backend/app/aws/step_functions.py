import json
from typing import Dict, Any

def get_step_functions_definition() -> Dict[str, Any]:
    """
    Returns the AWS Step Functions state machine definition JSON (ASL)
    representing the parallelized FirstPR analysis pipeline.
    """
    return {
        "Comment": "FirstPR Open Source Analysis & Verification Pipeline",
        "StartAt": "ValidateRepository",
        "States": {
            "ValidateRepository": {
                "Type": "Task",
                "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FirstPR-ValidateRepo",
                "Next": "IngestRepository",
                "Catch": [
                    {
                        "ErrorEquals": ["States.ALL"],
                        "Next": "PipelineFailed"
                    }
                ]
            },
            "IngestRepository": {
                "Type": "Task",
                "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FirstPR-IngestRepo",
                "Next": "ParallelAnalysis",
                "Catch": [
                    {
                        "ErrorEquals": ["States.ALL"],
                        "Next": "PipelineFailed"
                    }
                ]
            },
            "ParallelAnalysis": {
                "Type": "Parallel",
                "Branches": [
                    {
                        "StartAt": "MapCodebase",
                        "States": {
                            "MapCodebase": {
                                "Type": "Task",
                                "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FirstPR-MapCodebase",
                                "End": True
                            }
                        }
                    },
                    {
                        "StartAt": "AnalyzeIssues",
                        "States": {
                            "AnalyzeIssues": {
                                "Type": "Task",
                                "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FirstPR-AnalyzeIssues",
                                "End": True
                            }
                        }
                    },
                    {
                        "StartAt": "DetectStackAndVerifyEnvironment",
                        "States": {
                            "DetectStackAndVerifyEnvironment": {
                                "Type": "Task",
                                "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FirstPR-VerifyEnvironment",
                                "End": True
                            }
                        }
                    }
                ],
                "Next": "MergeAnalysis",
                "Catch": [
                    {
                        "ErrorEquals": ["States.ALL"],
                        "Next": "PipelineFailed"
                    }
                ]
            },
            "MergeAnalysis": {
                "Type": "Task",
                "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FirstPR-MergeAnalysis",
                "Next": "RankIssues"
            },
            "RankIssues": {
                "Type": "Task",
                "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FirstPR-RankIssues",
                "Next": "GenerateRepositorySummary"
            },
            "GenerateRepositorySummary": {
                "Type": "Task",
                "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FirstPR-GenerateSummary",
                "Next": "PersistReport"
            },
            "PersistReport": {
                "Type": "Task",
                "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FirstPR-PersistReport",
                "End": True
            },
            "PipelineFailed": {
                "Type": "Fail",
                "Cause": "Pipeline failed during repository ingestion or analysis."
            }
        }
    }
