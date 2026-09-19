import { FirstPRService } from './firstprService';
import {
  RepositoryAnalysis,
  AnalysisJob,
  GroundedWalkthrough
} from '../types';
import { mockFirstPRService } from './mockApi';

export class ApiFirstPRService implements FirstPRService {
  private apiBase = '/api';

  async getDemoRepositories(): Promise<RepositoryAnalysis[]> {
    try {
      const res = await fetch(`${this.apiBase}/demo-repositories`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API unavailable, falling back to mock:', e);
    }
    return mockFirstPRService.getDemoRepositories();
  }

  async analyzeRepository(repositoryUrl: string, forceRefresh = false): Promise<AnalysisJob> {
    try {
      const res = await fetch(`${this.apiBase}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repository_url: repositoryUrl, force_refresh: forceRefresh })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API analyze unavailable, falling back to mock:', e);
    }
    return mockFirstPRService.analyzeRepository(repositoryUrl, forceRefresh);
  }

  async getAnalysisJob(jobId: string): Promise<AnalysisJob> {
    try {
      const res = await fetch(`${this.apiBase}/jobs/${jobId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getJob unavailable, falling back to mock:', e);
    }
    return mockFirstPRService.getAnalysisJob(jobId);
  }

  async getReport(reportId: string): Promise<RepositoryAnalysis> {
    try {
      const res = await fetch(`${this.apiBase}/reports/${reportId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getReport unavailable, falling back to mock:', e);
    }
    return mockFirstPRService.getReport(reportId);
  }

  async getWalkthrough(reportId: string, issueNumber: number): Promise<GroundedWalkthrough> {
    try {
      const res = await fetch(`${this.apiBase}/reports/${reportId}/issues/${issueNumber}/walkthrough`, {
        method: 'POST'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getWalkthrough unavailable, falling back to mock:', e);
    }
    return mockFirstPRService.getWalkthrough(reportId, issueNumber);
  }
}

export const apiFirstPRService = new ApiFirstPRService();
