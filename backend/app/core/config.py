import os
from typing import Dict, List, Any
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FirstPR"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # GitHub Settings
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    GITHUB_API_BASE: str = "https://api.github.com"
    GITHUB_REQUEST_TIMEOUT_SECONDS: int = 15
    
    # Codebase Ingestion Caps (Section 8)
    MAX_FILES_TO_ANALYZE: int = 250
    MAX_FILE_SIZE_BYTES: int = 500 * 1024  # 500 KB
    MAX_TOTAL_BYTES: int = 25 * 1024 * 1024  # 25 MB
    MAX_CHUNK_TOKENS: int = 1000
    
    # Environment Verification Sandbox Settings (Section 10)
    SANDBOX_TIMEOUT_SECONDS: int = 45
    SANDBOX_MEMORY_LIMIT_MB: int = 2048
    SANDBOX_CPU_LIMIT: str = "1024"
    ALLOW_LOCAL_SUBPROCESS_EXECUTION: bool = True
    
    # 7-Signal Difficulty Weights (Section 7: Transparent central weights)
    # Total sum of weights equals 1.0
    SIGNAL_WEIGHTS: Dict[str, float] = {
        "blast_radius": 0.22,           # Signal 1: Number of files/modules affected
        "structural_centrality": 0.16,  # Signal 2: Import graph importance & central vs leaf
        "local_complexity": 0.14,       # Signal 3: AST LOC, nesting, branches, cyclomatic
        "test_proximity": 0.14,         # Signal 4: Distance & coverage of related tests (inverted difficulty)
        "specification_quality": 0.16,  # Signal 5: Repro steps, logs, clarity (inverted difficulty)
        "social_state": 0.10,           # Signal 6: Claims, assignees, staleness, active PRs
        "domain_prerequisites": 0.08    # Signal 7: Specialized domain knowledge (crypto, kernel, etc.)
    }
    
    # Scoring Category Thresholds
    GENUINELY_BEGINNER_MAX_SCORE: float = 35.0
    MODERATE_MAX_SCORE: float = 65.0
    # > 65.0 with "good first issue" / beginner label is classified as "Mislabelled"
    
    # AWS Settings
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    DYNAMODB_TABLE_REPORTS: str = os.getenv("DYNAMODB_TABLE_REPORTS", "FirstPR-Reports")
    DYNAMODB_TABLE_CACHE: str = os.getenv("DYNAMODB_TABLE_CACHE", "FirstPR-Cache")
    S3_BUCKET_ARTIFACTS: str = os.getenv("S3_BUCKET_ARTIFACTS", "firstpr-artifacts-bucket")
    BEDROCK_MODEL_ID: str = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20241022-v2:0")
    FARGATE_CLUSTER_NAME: str = os.getenv("FARGATE_CLUSTER_NAME", "FirstPR-Sandbox-Cluster")
    FARGATE_TASK_DEFINITION: str = os.getenv("FARGATE_TASK_DEFINITION", "firstpr-sandbox-task")
    
    # Cache TTL (24 hours in seconds)
    CACHE_TTL_SECONDS: int = 86400
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
