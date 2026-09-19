export type DifficultyLevel = 'Genuinely Beginner' | 'Moderate' | 'Mislabelled';
export type VerificationStatus = 'Verified' | 'Partially Verified' | 'Verification Failed' | 'Timed Out' | 'Unsupported Stack';
export type StepStatus = 'pending' | 'running' | 'completed' | 'warning' | 'failed' | 'skipped';
export type JobStatus = 'QUEUED' | 'INGESTING' | 'MAPPING' | 'SCORING' | 'VERIFYING' | 'FINALIZING' | 'COMPLETE' | 'PARTIAL' | 'FAILED';

export interface DifficultySignal {
  name: string;
  score: number;
  weight: number;
  weighted_score: number;
  rating_label: 'Low' | 'Moderate' | 'High' | 'Strong' | 'Weak' | 'Excellent' | 'Minimal' | 'Available' | 'Claimed';
  evidence: string[];
  explanation: string;
}

export interface IssueDifficultyScore {
  total_score: number;
  category: DifficultyLevel;
  signals: Record<string, DifficultySignal>;
  confidence: number;
  summary_explanation: string;
  is_mislabelled: boolean;
  mislabelled_reasons?: string[];
}

export interface IssueCandidate {
  number: number;
  title: string;
  body?: string;
  html_url: string;
  labels: string[];
  state: 'open' | 'closed';
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
  recommended_fix?: string;
  is_sandboxed: boolean;
}

export interface CodebaseNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: CodebaseNode[];
  is_target?: boolean;
  is_test?: boolean;
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
  loc_estimate?: string;
  total_source_files?: number;
  total_test_files?: number;
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
  tree_structure?: CodebaseNode[];
}

export interface FileReadingStep {
  order: number;
  path: string;
  phase_label: 'Start here' | 'Understand this next' | 'Then inspect the tests' | 'Reference';
  purpose: string;
  why_it_matters: string;
  is_target_file: boolean;
  key_symbols: string[];
  exists_in_repo: boolean;
}

export interface ContributionPlanStep {
  step_number: number;
  title: string;
  detail: string;
  command?: string;
}

export interface GroundedWalkthrough {
  issue_number: number;
  issue_title: string;
  simple_explanation: string;
  difficulty_justification: string;
  estimated_scope: {
    files_count: number;
    test_count: number;
    scope_description: string;
  };
  files_to_read: FileReadingStep[];
  likely_change_location: {
    file: string;
    symbol: string;
    confidence: 'High confidence' | 'Moderate confidence' | 'Heuristic match';
    reason: string;
  };
  contribution_plan: ContributionPlanStep[];
  relevant_tests: string[];
  test_commands: {
    focused_command: string;
    full_suite_command: string;
  };
  test_validation_guidance: string;
  before_opening_pr_checklist: {
    label: string;
    source: 'README' | 'CONTRIBUTING.md' | 'PR template' | 'CI workflow';
  }[];
  repository_conventions: {
    branch_naming?: string;
    commit_style?: string;
    lint_tool?: string;
    formatting_tool?: string;
    contributing_guide_path?: string;
  };
  why_firstpr_chose_this: string[];
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
  scenario_tag?: string;
  summary: RepositorySummary;
  environment: EnvironmentVerification;
  ranked_issues: IssueCandidate[];
  analysis_duration_ms: number;
  cost_estimate_usd: number;
  metrics_summary: {
    issues_analyzed_count: number;
    good_candidates_count: number;
    mislabelled_count: number;
    setup_confidence_score: number;
  };
}

export interface PipelineStage {
  id: string;
  name: string;
  detail?: string;
  status: StepStatus;
  duration_label?: string;
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
  metrics_sidebar?: {
    files_inspected: number;
    issues_evaluated: number;
    tests_detected: number;
    likely_setup: string[];
    analysis_mode: string;
  };
}

export type AppView = 'home' | 'analysis' | 'report' | 'walkthrough';
export type IssueFilter = 'all' | 'beginner' | 'moderate' | 'mislabelled' | 'available';
export type IssueSort = 'best_match' | 'lowest_difficulty' | 'newest';
