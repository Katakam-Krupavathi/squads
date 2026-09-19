import { firstprService } from './index';
import { RepositoryAnalysis, AnalysisJob, GroundedWalkthrough } from '../types';

export const fetchDemoRepositories = () => firstprService.getDemoRepositories();
export const submitAnalysis = (url: string, forceRefresh = false) => firstprService.analyzeRepository(url, forceRefresh);
export const fetchJobStatus = (jobId: string) => firstprService.getAnalysisJob(jobId);
export const fetchReport = (reportId: string) => firstprService.getReport(reportId);
export const fetchWalkthrough = (reportId: string, issueNumber: number) => firstprService.getWalkthrough(reportId, issueNumber);
