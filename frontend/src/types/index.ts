export type DifficultyCategory = 'Genuinely Beginner' | 'Moderate' | 'Mislabelled';
export type VerificationStatus = 'Verified' | 'Partially Verified' | 'Verification Failed' | 'Timed Out' | 'Unsupported Stack';
export type StepStatus = 'pending' | 'running' | 'completed' | 'warning' | 'failed' | 'skipped';
export type JobStatus = 'QUEUED' | 'INGESTING' | 'MAPPING' | 'SCORING' | 'VERIFYING' | 'FINALIZING' | 'COMPLETE' | 'PARTIAL' | 'FAILED';

export interface DifficultySignal {
  name: string;
  score: number;
  weight: number;
  weighted_score: number;
  evidence: string[];
  explanation: string;
}

export interface IssueDifficultyScore {
  total_score: number;
  category: DifficultyCategory;
  signals: Record<string, DifficultySignal>;
  confidence: number;
  summary_explanation: string;
  is_mislabelled: boolean;
}

export interface IssueCandidate {
  number: number;
  title: string;
  body?: string;
  html_url: string;
  labels: string[];
  state: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
  comments_count: number;
  assignees: string[];
  difficulty: IssueDifficultyScore;
  likely_affected_files: string[];
  potential_blockers: string[];
  specification_quality_score: number;
  test_availability: string;
  social_state: string;
  has_linked_pr: boolean;
  is_stale: boolean;
}

export interface VerificationStep {
  name: string;
  command: string;
  status: StepStatus;
  exit_code?: number;
  duration_ms: number;
  stdout: string;
  stderr: string;
  error_summary?: string;
}

export interface EnvironmentVerification {
  runtime: string;
  package_manager: string;
  install_command?: string;
  build_command?: string;
  test_command?: string;
  status: VerificationStatus;
  execution_timestamp: string;
  total_duration_ms: number;
  steps: VerificationStep[];
  sandbox_provider: string;
  cpu_limit: string;
  memory_limit: string;
  timeout_seconds: number;
  failure_stage?: string;
  error_summary?: string;
  is_sandboxed: boolean;
}

export interface RepositoryStack {
  primary_language: string;
  languages: Record<string, number>;
  frameworks: string[];
  package_manager: string;
  test_framework?: string;
  test_locations: string[];
  source_directories: string[];
  entry_points: string[];
  config_files: string[];
  ci_workflows: string[];
}

export interface RepositorySummary {
  owner: string;
  repo: string;
  full_name: string;
  description?: string;
  default_branch: string;
  latest_commit_sha?: string;
  stars: number;
  forks: number;
  open_issues_count: number;
  repository_size_kb: number;
  stack: RepositoryStack;
  readme_snippet?: string;
  contributing_snippet?: string;
  architecture_overview: string;
  total_files_analyzed: number;
}

export interface FileReadingStep {
  order: number;
  path: string;
  purpose: string;
  is_target_file: boolean;
  key_symbols: string[];
  exists_in_repo: boolean;
}

export interface GroundedWalkthrough {
  issue_number: number;
  issue_title: string;
  simple_explanation: string;
  difficulty_justification: string;
  files_to_read: FileReadingStep[];
  likely_change_location: string;
  likely_functions_or_classes: string[];
  relevant_tests: string[];
  test_validation_guidance: string;
  repository_conventions: {
    branch_naming?: string;
    commit_style?: string;
    pr_checklist?: string[];
    lint_tool?: string;
    formatting_tool?: string;
    contributing_guide_path?: string;
  };
  grounding_validated: boolean;
  validated_file_count: number;
  model_provider: string;
}

export interface RepositoryAnalysis {
  id: string;
  repository_url: string;
  analyzed_at: string;
  is_cached: boolean;
  cached_timestamp?: string;
  summary: RepositorySummary;
  environment: EnvironmentVerification;
  ranked_issues: IssueCandidate[];
  analysis_duration_ms: number;
  cost_estimate_usd: number;
}

export interface PipelineStage {
  name: string;
  status: StepStatus;
  message?: string;
  timestamp?: string;
}

export interface AnalysisJob {
  job_id: string;
  repository_url: string;
  status: JobStatus;
  stages: PipelineStage[];
  current_stage: string;
  progress_percentage: number;
  report_id?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}
