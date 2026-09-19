import { FirstPRService } from './firstprService';
import {
  RepositoryAnalysis,
  AnalysisJob,
  GroundedWalkthrough,
  PipelineStage,
  StepStatus
} from '../types';
import { MOCK_ANALYSES } from '../mocks/analyses';
import { MOCK_WALKTHROUGHS } from '../mocks/walkthroughs';
import { DEFAULT_PIPELINE_STAGES } from '../mocks/pipeline';

function identifyScenarioKey(url: string): string {
  const lower = (url || '').toLowerCase();
  if (lower.includes('fastapi')) return 'fastapi/fastapi';
  if (lower.includes('ms') || lower.includes('vercel')) return 'vercel/ms';
  if (lower.includes('broken-build')) return 'example/broken-build';
  if (lower.includes('unsupported-stack') || lower.includes('firmware')) return 'example/unsupported-stack';
  return 'chalk/chalk';
}

export class MockFirstPRService implements FirstPRService {
  private activeJobs: Map<string, { job: AnalysisJob; startTime: number; scenarioKey: string }> = new Map();

  async getDemoRepositories(): Promise<RepositoryAnalysis[]> {
    await this.delay(100);
    return Object.values(MOCK_ANALYSES);
  }

  async analyzeRepository(repositoryUrl: string, forceRefresh = false): Promise<AnalysisJob> {
    await this.delay(300);

    const scenarioKey = identifyScenarioKey(repositoryUrl);
    const analysis = MOCK_ANALYSES[scenarioKey] || MOCK_ANALYSES['chalk/chalk'];
    const jobId = `job-mock-${Date.now().toString(36)}`;

    const initialStages: PipelineStage[] = DEFAULT_PIPELINE_STAGES.map((s, idx) => ({
      ...s,
      status: idx === 0 ? 'running' : 'pending',
      timestamp: new Date().toISOString()
    }));

    const job: AnalysisJob = {
      job_id: jobId,
      repository_url: repositoryUrl,
      status: 'INGESTING',
      stages: initialStages,
      current_stage: initialStages[0].name,
      progress_percentage: 11,
      report_id: analysis.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metrics_sidebar: {
        files_inspected: analysis.summary.total_files_analyzed,
        issues_evaluated: analysis.metrics_summary.issues_analyzed_count,
        tests_detected: analysis.summary.stack.total_test_files ? analysis.summary.stack.total_test_files * 14 : 48,
        likely_setup: [analysis.environment.install_command || 'npm ci', analysis.environment.test_command || 'npm test'],
        analysis_mode: 'Deterministic Demo Runner'
      }
    };

    this.activeJobs.set(jobId, {
      job,
      startTime: Date.now(),
      scenarioKey
    });

    return job;
  }

  async getAnalysisJob(jobId: string): Promise<AnalysisJob> {
    const entry = this.activeJobs.get(jobId);
    if (!entry) {
      const fallbackAnalysis = MOCK_ANALYSES['chalk/chalk'];
      return {
        job_id: jobId,
        repository_url: fallbackAnalysis.repository_url,
        status: 'COMPLETE',
        stages: DEFAULT_PIPELINE_STAGES.map(s => ({ ...s, status: 'completed' as StepStatus })),
        current_stage: 'COMPLETE',
        progress_percentage: 100,
        report_id: fallbackAnalysis.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    const { job, startTime } = entry;
    const elapsedMs = Date.now() - startTime;
    const stepDurationMs = 380; // Fast and deterministic for smooth UI animation

    const totalSteps = job.stages.length;
    const completedSteps = Math.min(totalSteps, Math.floor(elapsedMs / stepDurationMs) + 1);

    const updatedStages: PipelineStage[] = job.stages.map((stage, idx) => {
      let status: StepStatus = 'pending';
      if (idx < completedSteps - 1) {
        status = 'completed';
      } else if (idx === completedSteps - 1 && completedSteps <= totalSteps) {
        status = completedSteps === totalSteps ? 'completed' : 'running';
      }
      return { ...stage, status };
    });

    const isComplete = completedSteps >= totalSteps;
    const progressPercentage = Math.min(100, Math.round((completedSteps / totalSteps) * 100));

    const updatedJob: AnalysisJob = {
      ...job,
      stages: updatedStages,
      current_stage: isComplete ? 'Preparing repository report' : updatedStages[completedSteps - 1]?.name || 'Mapping source code',
      progress_percentage: isComplete ? 100 : progressPercentage,
      status: isComplete ? 'COMPLETE' : 'INGESTING',
      updated_at: new Date().toISOString()
    };

    entry.job = updatedJob;
    return updatedJob;
  }

  async getReport(reportId: string): Promise<RepositoryAnalysis> {
    await this.delay(200);
    const found = Object.values(MOCK_ANALYSES).find(
      a => a.id === reportId || a.summary.repo === reportId || a.summary.full_name === reportId
    );
    if (found) return found;
    return MOCK_ANALYSES['chalk/chalk'];
  }

  async getWalkthrough(reportId: string, issueNumber: number): Promise<GroundedWalkthrough> {
    await this.delay(350);

    for (const [repoKey, issueMap] of Object.entries(MOCK_WALKTHROUGHS)) {
      if (issueMap[issueNumber]) {
        return issueMap[issueNumber];
      }
    }

    return MOCK_WALKTHROUGHS['chalk/chalk'][524];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockFirstPRService = new MockFirstPRService();
