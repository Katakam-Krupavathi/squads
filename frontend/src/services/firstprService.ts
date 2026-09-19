import {
  RepositoryAnalysis,
  AnalysisJob,
  GroundedWalkthrough
} from '../types';

export interface FirstPRService {
  getDemoRepositories(): Promise<RepositoryAnalysis[]>;
  analyzeRepository(repositoryUrl: string, forceRefresh?: boolean): Promise<AnalysisJob>;
  getAnalysisJob(jobId: string): Promise<AnalysisJob>;
  getReport(reportId: string): Promise<RepositoryAnalysis>;
  getWalkthrough(reportId: string, issueNumber: number): Promise<GroundedWalkthrough>;
}
