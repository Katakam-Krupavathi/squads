from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime

class DifficultyCategory(str, Enum):
    GENUINELY_BEGINNER = "Genuinely Beginner"
    MODERATE = "Moderate"
    MISLABELLED = "Mislabelled"

class VerificationStatus(str, Enum):
    VERIFIED = "Verified"
    PARTIALLY_VERIFIED = "Partially Verified"
    VERIFICATION_FAILED = "Verification Failed"
    TIMED_OUT = "Timed Out"
    UNSUPPORTED = "Unsupported Stack"

class StepStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    WARNING = "warning"
    FAILED = "failed"
    SKIPPED = "skipped"

class JobStatus(str, Enum):
    QUEUED = "QUEUED"
    INGESTING = "INGESTING"
    MAPPING = "MAPPING"
    SCORING = "SCORING"
    VERIFYING = "VERIFYING"
    FINALIZING = "FINALIZING"
    COMPLETE = "COMPLETE"
    PARTIAL = "PARTIAL"
    FAILED = "FAILED"

class DifficultySignal(BaseModel):
    name: str = Field(..., description="Name of the signal (e.g., Blast Radius, Structural Centrality)")
    score: float = Field(..., ge=0.0, le=100.0, description="Normalized score 0 (easy) to 100 (difficult)")
    weight: float = Field(..., ge=0.0, le=1.0, description="Weight in overall formula")
    weighted_score: float = Field(..., description="Score * weight")
    evidence: List[str] = Field(default_factory=list, description="Measurable repository facts/evidence")
    explanation: str = Field(..., description="Clear human-readable explanation")

class IssueDifficultyScore(BaseModel):
    total_score: float = Field(..., ge=0.0, le=100.0, description="Overall difficulty score 0-100")
    category: DifficultyCategory = Field(..., description="Classification bucket")
    signals: Dict[str, DifficultySignal] = Field(..., description="Map of signal name to signal details")
    confidence: float = Field(default=0.95, ge=0.0, le=1.0)
    summary_explanation: str = Field(..., description="Grounded explanation referencing evidence")
    is_mislabelled: bool = Field(default=False, description="True if GitHub label is beginner but difficulty is high")

class IssueCandidate(BaseModel):
    number: int
    title: str
    body: Optional[str] = ""
    html_url: str
    labels: List[str] = Field(default_factory=list)
    state: str = "open"
    author: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    comments_count: int = 0
    assignees: List[str] = Field(default_factory=list)
    difficulty: IssueDifficultyScore
    likely_affected_files: List[str] = Field(default_factory=list)
    potential_blockers: List[str] = Field(default_factory=list)
    specification_quality_score: float = 0.0
    test_availability: str = "Unknown"
    social_state: str = "Available" # Available, Claimed, Stale, In-Progress
    has_linked_pr: bool = False
    is_stale: bool = False

class VerificationStep(BaseModel):
    name: str = Field(..., description="Step name: install, build, test")
    command: str = Field(..., description="Exact command executed")
    status: StepStatus = Field(default=StepStatus.PENDING)
    exit_code: Optional[int] = None
    duration_ms: int = 0
    stdout: str = ""
    stderr: str = ""
    error_summary: Optional[str] = None

class EnvironmentVerification(BaseModel):
    runtime: str = Field(..., description="Detected runtime, e.g. Node.js 20, Python 3.12")
    package_manager: str = Field(..., description="e.g. npm, pnpm, yarn, pip, poetry, uv")
    install_command: Optional[str] = None
    build_command: Optional[str] = None
    test_command: Optional[str] = None
    status: VerificationStatus = Field(default=VerificationStatus.VERIFICATION_FAILED)
    execution_timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    total_duration_ms: int = 0
    steps: List[VerificationStep] = Field(default_factory=list)
    sandbox_provider: str = "AWS ECS/Fargate (Isolated Container)"
    cpu_limit: str = "1 vCPU"
    memory_limit: str = "2 GB"
    timeout_seconds: int = 60
    failure_stage: Optional[str] = None
    error_summary: Optional[str] = None
    is_sandboxed: bool = True

class RepositoryStack(BaseModel):
    primary_language: str
    languages: Dict[str, float] = Field(default_factory=dict)
    frameworks: List[str] = Field(default_factory=list)
    package_manager: str = "unknown"
    test_framework: Optional[str] = None
    test_locations: List[str] = Field(default_factory=list)
    source_directories: List[str] = Field(default_factory=list)
    entry_points: List[str] = Field(default_factory=list)
    config_files: List[str] = Field(default_factory=list)
    ci_workflows: List[str] = Field(default_factory=list)

class RepositorySummary(BaseModel):
    owner: str
    repo: str
    full_name: str
    description: Optional[str] = ""
    default_branch: str = "main"
    latest_commit_sha: Optional[str] = None
    stars: int = 0
    forks: int = 0
    open_issues_count: int = 0
    repository_size_kb: int = 0
    stack: RepositoryStack
    readme_snippet: Optional[str] = None
    contributing_snippet: Optional[str] = None
    architecture_overview: str = ""
    total_files_analyzed: int = 0

class FileReadingStep(BaseModel):
    order: int
    path: str
    purpose: str
    is_target_file: bool = False
    key_symbols: List[str] = Field(default_factory=list)
    exists_in_repo: bool = True

class GroundedWalkthrough(BaseModel):
    issue_number: int
    issue_title: str
    simple_explanation: str
    difficulty_justification: str
    files_to_read: List[FileReadingStep] = Field(default_factory=list)
    likely_change_location: str
    likely_functions_or_classes: List[str] = Field(default_factory=list)
    relevant_tests: List[str] = Field(default_factory=list)
    test_validation_guidance: str
    repository_conventions: Dict[str, Any] = Field(default_factory=dict)
    grounding_validated: bool = True
    validated_file_count: int = 0
    model_provider: str = "Amazon Bedrock (Claude 3.5 Sonnet / Llama 3) + Grounding Verifier"

class RepositoryAnalysis(BaseModel):
    id: str
    repository_url: str
    analyzed_at: str
    is_cached: bool = False
    cached_timestamp: Optional[str] = None
    summary: RepositorySummary
    environment: EnvironmentVerification
    ranked_issues: List[IssueCandidate] = Field(default_factory=list)
    analysis_duration_ms: int = 0
    cost_estimate_usd: float = 0.0028

class AnalyzeRequest(BaseModel):
    repository_url: str = Field(..., description="Public GitHub repository URL")
    force_refresh: bool = False

class PipelineStage(BaseModel):
    name: str
    status: StepStatus
    message: Optional[str] = None
    timestamp: Optional[str] = None

class AnalysisJob(BaseModel):
    job_id: str
    repository_url: str
    status: JobStatus
    stages: List[PipelineStage] = Field(default_factory=list)
    current_stage: str = "QUEUED"
    progress_percentage: int = 0
    report_id: Optional[str] = None
    error: Optional[str] = None
    created_at: str
    updated_at: str
