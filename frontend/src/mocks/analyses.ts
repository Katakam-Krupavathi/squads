import { RepositoryAnalysis } from '../types';
import { MOCK_REPOSITORIES } from './repositories';
import { MOCK_ISSUES } from './issues';
import { MOCK_ENVIRONMENTS } from './environments';

export const MOCK_ANALYSES: Record<string, RepositoryAnalysis> = {
  'chalk/chalk': {
    id: 'chalk-chalk',
    repository_url: 'https://github.com/chalk/chalk',
    analyzed_at: '2026-09-19T18:30:00Z',
    is_cached: true,
    cached_timestamp: '2026-09-19T18:30:00Z',
    scenario_tag: 'Node.js / Verified / Mislabelled Exposure',
    summary: MOCK_REPOSITORIES['chalk/chalk'],
    environment: MOCK_ENVIRONMENTS['chalk/chalk'],
    ranked_issues: MOCK_ISSUES['chalk/chalk'],
    analysis_duration_ms: 4820,
    cost_estimate_usd: 0.0024,
    metrics_summary: {
      issues_analyzed_count: 7,
      good_candidates_count: 2,
      mislabelled_count: 1,
      setup_confidence_score: 98
    }
  },

  'fastapi/fastapi': {
    id: 'fastapi-fastapi',
    repository_url: 'https://github.com/fastapi/fastapi',
    analyzed_at: '2026-09-19T18:35:00Z',
    is_cached: true,
    cached_timestamp: '2026-09-19T18:35:00Z',
    scenario_tag: 'Python / pytest / Rich Codebase',
    summary: MOCK_REPOSITORIES['fastapi/fastapi'],
    environment: MOCK_ENVIRONMENTS['fastapi/fastapi'],
    ranked_issues: MOCK_ISSUES['fastapi/fastapi'],
    analysis_duration_ms: 6140,
    cost_estimate_usd: 0.0031,
    metrics_summary: {
      issues_analyzed_count: 12,
      good_candidates_count: 2,
      mislabelled_count: 1,
      setup_confidence_score: 96
    }
  },

  'vercel/ms': {
    id: 'vercel-ms',
    repository_url: 'https://github.com/vercel/ms',
    analyzed_at: '2026-09-19T18:40:00Z',
    is_cached: true,
    cached_timestamp: '2026-09-19T18:40:00Z',
    scenario_tag: 'TypeScript / Fast Micro-Package',
    summary: MOCK_REPOSITORIES['vercel/ms'],
    environment: MOCK_ENVIRONMENTS['vercel/ms'],
    ranked_issues: MOCK_ISSUES['vercel/ms'],
    analysis_duration_ms: 1840,
    cost_estimate_usd: 0.0012,
    metrics_summary: {
      issues_analyzed_count: 3,
      good_candidates_count: 1,
      mislabelled_count: 0,
      setup_confidence_score: 100
    }
  },

  'example/broken-build': {
    id: 'example-broken-build',
    repository_url: 'https://github.com/example/broken-build',
    analyzed_at: '2026-09-19T18:42:00Z',
    is_cached: true,
    cached_timestamp: '2026-09-19T18:42:00Z',
    scenario_tag: 'Partial Verification / Build Mismatch Failure',
    summary: MOCK_REPOSITORIES['example/broken-build'],
    environment: MOCK_ENVIRONMENTS['example/broken-build'],
    ranked_issues: MOCK_ISSUES['example/broken-build'],
    analysis_duration_ms: 8200,
    cost_estimate_usd: 0.0029,
    metrics_summary: {
      issues_analyzed_count: 8,
      good_candidates_count: 0,
      mislabelled_count: 0,
      setup_confidence_score: 45
    }
  },

  'example/unsupported-stack': {
    id: 'example-unsupported-stack',
    repository_url: 'https://github.com/example/unsupported-stack',
    analyzed_at: '2026-09-19T18:45:00Z',
    is_cached: true,
    cached_timestamp: '2026-09-19T18:45:00Z',
    scenario_tag: 'Unsupported Stack / Bare-Metal Hardware',
    summary: MOCK_REPOSITORIES['example/unsupported-stack'],
    environment: MOCK_ENVIRONMENTS['example/unsupported-stack'],
    ranked_issues: MOCK_ISSUES['example/unsupported-stack'],
    analysis_duration_ms: 1200,
    cost_estimate_usd: 0.0008,
    metrics_summary: {
      issues_analyzed_count: 6,
      good_candidates_count: 1,
      mislabelled_count: 0,
      setup_confidence_score: 20
    }
  }
};
