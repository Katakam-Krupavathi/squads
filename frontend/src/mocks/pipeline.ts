import { PipelineStage } from '../types';

export const DEFAULT_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'github_connect',
    name: '1. Connecting to GitHub',
    detail: 'Authenticated via GitHub REST & GraphQL API',
    status: 'pending',
    duration_label: '0.4s'
  },
  {
    id: 'read_structure',
    name: '2. Reading repository structure',
    detail: 'Ingested git tree and file manifests',
    status: 'pending',
    duration_label: '0.8s'
  },
  {
    id: 'detect_stack',
    name: '3. Detecting project stack',
    detail: 'Identified runtime, package manager, and test harness',
    status: 'pending',
    duration_label: '0.6s'
  },
  {
    id: 'map_codebase',
    name: '4. Mapping source code',
    detail: 'Constructed AST import dependencies and module centrality graph',
    status: 'pending',
    duration_label: '1.3s'
  },
  {
    id: 'find_issues',
    name: '5. Finding beginner-labelled issues',
    detail: 'Retrieved candidate open issues from repository tracker',
    status: 'pending',
    duration_label: '0.7s'
  },
  {
    id: 'calculate_signals',
    name: '6. Calculating difficulty signals',
    detail: 'Computed 7 transparent signals across blast radius, complexity, and tests',
    status: 'pending',
    duration_label: '1.2s'
  },
  {
    id: 'check_availability',
    name: '7. Checking issue availability',
    detail: 'Analyzed assignees, comment claims, and active pull requests',
    status: 'pending',
    duration_label: '0.5s'
  },
  {
    id: 'verify_environment',
    name: '8. Verifying development environment',
    detail: 'Executed install, build, and test steps in isolated container',
    status: 'pending',
    duration_label: '3.8s'
  },
  {
    id: 'prepare_report',
    name: '9. Preparing repository report',
    detail: 'Synthesized grounded walkthroughs and verified report',
    status: 'pending',
    duration_label: '0.4s'
  }
];

export function getPipelineStagesForRepo(repoName: string): PipelineStage[] {
  return DEFAULT_PIPELINE_STAGES.map((s) => ({
    ...s,
    status: 'pending'
  }));
}
