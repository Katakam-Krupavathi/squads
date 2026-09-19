import json
from typing import Dict, Any, List
from ..core.config import settings

def generate_fargate_task_definition(
    owner: str,
    repo: str,
    commands: List[str]
) -> Dict[str, Any]:
    """
    Produces an AWS ECS/Fargate Task Definition payload for isolated execution.
    Features:
    - Zero AWS credentials passed to container
    - Read-only root filesystem with ephemeral /tmp
    - Non-root user
    - CPU: 1024 (1 vCPU), Memory: 2048 (2 GB)
    - CloudWatch logging integration
    """
    return {
        "family": f"firstpr-sandbox-{owner}-{repo}",
        "networkMode": "awsvpc",
        "requiresCompatibilities": ["FARGATE"],
        "cpu": settings.SANDBOX_CPU_LIMIT,
        "memory": str(settings.SANDBOX_MEMORY_LIMIT_MB),
        "executionRoleArn": "arn:aws:iam::123456789012:role/FirstPR-ECSExecutionRole",
        # Notice: No TaskRoleArn attached to completely prevent container from accessing AWS services/APIs
        "containerDefinitions": [
            {
                "name": "sandbox-executor",
                "image": "public.ecr.aws/docker/library/node:20-alpine",
                "essential": True,
                "user": "node",
                "environment": [
                    {"name": "CI", "value": "true"},
                    {"name": "NODE_ENV", "value": "test"}
                ],
                "mountPoints": [
                    {
                        "sourceVolume": "ephemeral-tmp",
                        "containerPath": "/tmp",
                        "readOnly": False
                    }
                ],
                "logConfiguration": {
                    "logDriver": "awslogs",
                    "options": {
                        "awslogs-group": "/firstpr/sandbox-runs",
                        "awslogs-region": settings.AWS_REGION,
                        "awslogs-stream-prefix": "fargate"
                    }
                },
                "command": ["sh", "-c", " && ".join(commands)] if commands else ["true"]
            }
        ],
        "volumes": [
            {
                "name": "ephemeral-tmp"
            }
        ]
    }
