import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RepoInput } from './components/RepoInput';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ReportHeader } from './components/ReportHeader';
import { RepoAtAGlance } from './components/RepoAtAGlance';
import { RankedIssues } from './components/RankedIssues';
import { VerifiedEnvironment } from './components/VerifiedEnvironment';
import { WalkthroughView } from './components/WalkthroughView';
import { ArchitectureModal } from './components/ArchitectureModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ErrorState, EmptyState } from './components/EmptyState';
import {
  RepositoryAnalysis,
  AnalysisJob,
  IssueCandidate,
  GroundedWalkthrough,
  AppView
} from './types';
import { firstprService } from './services';
import { GitPullRequest } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [demoRepos, setDemoRepos] = useState<RepositoryAnalysis[]>([]);
  const [currentJob, setCurrentJob] = useState<AnalysisJob | null>(null);
  const [currentReport, setCurrentReport] = useState<RepositoryAnalysis | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssueCandidate | null>(null);
  const [currentWalkthrough, setCurrentWalkthrough] = useState<GroundedWalkthrough | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  useEffect(() => {
    firstprService.getDemoRepositories()
      .then(setDemoRepos)
      .catch(err => console.warn('Failed to load demo repositories:', err));
  }, []);

  const handleStartAnalysis = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentReport(null);
    setCurrentJob(null);
    setCurrentView('analysis');

    try {
      const job = await firstprService.analyzeRepository(url);
      setCurrentJob(job);
      pollJob(job.job_id);
    } catch (err: any) {
      setError(err.message || 'Failed to start repository analysis.');
      setIsLoading(false);
    }
  };

  const pollJob = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const updatedJob = await firstprService.getAnalysisJob(jobId);
        setCurrentJob(updatedJob);

        if (updatedJob.status === 'COMPLETE' && updatedJob.report_id) {
          clearInterval(interval);
          const report = await firstprService.getReport(updatedJob.report_id);
          setCurrentReport(report);
          setIsLoading(false);
          // Small automatic delay to allow user to appreciate completion
          setTimeout(() => {
            setCurrentView('report');
          }, 800);
        } else if (updatedJob.status === 'FAILED') {
          clearInterval(interval);
          setError(updatedJob.error || 'Analysis failed.');
          setIsLoading(false);
        }
      } catch (err) {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 400);
  };

  const handleSelectWalkthrough = async (issue: IssueCandidate) => {
    if (!currentReport) return;
    setSelectedIssue(issue);
    setIsLoading(true);

    try {
      const wt = await firstprService.getWalkthrough(currentReport.id, issue.number);
      setCurrentWalkthrough(wt);
      setCurrentView('walkthrough');
    } catch (err) {
      console.error('Error loading walkthrough:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentJob(null);
    setCurrentReport(null);
    setSelectedIssue(null);
    setCurrentWalkthrough(null);
    setError(null);
    setIsLoading(false);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Top App Shell Navbar */}
      <Navbar
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onReset={handleReset}
        currentView={currentView}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Error State */}
        {error && (
          <ErrorState
            error={error}
            onReset={handleReset}
            onRetry={() => currentJob && handleStartAnalysis(currentJob.repository_url)}
          />
        )}

        {/* Screen 1: Home / Input */}
        {!error && currentView === 'home' && (
          <RepoInput
            onAnalyze={handleStartAnalysis}
            isLoading={isLoading}
            demoRepos={demoRepos}
          />
        )}

        {/* Screen 2: Analysis Progress */}
        {!error && currentView === 'analysis' && currentJob && (
          <AnalysisProgress
            job={currentJob}
            onViewReport={() => setCurrentView('report')}
          />
        )}

        {/* Screen 3: Repository Report */}
        {!error && currentView === 'report' && currentReport && (
          <div className="space-y-8 animate-fadeIn" data-testid="report-page">
            
            {/* Report Header & 4-Metric Summary Strip */}
            <ReportHeader
              analysis={currentReport}
              onRerun={() => handleStartAnalysis(currentReport.repository_url)}
              onOpenArchitecture={() => setIsArchitectureOpen(true)}
            />

            {/* Panel A: Repository At A Glance & Codebase Map */}
            <RepoAtAGlance summary={currentReport.summary} />

            {/* Panel B: Ranked Beginner Issues & Mislabelled Spotlight */}
            <RankedIssues
              issues={currentReport.ranked_issues}
              onSelectWalkthrough={handleSelectWalkthrough}
            />

            {/* Panel C: Development Environment & Terminal Logs */}
            <VerifiedEnvironment environment={currentReport.environment} />

          </div>
        )}

        {/* Screen 4: Guided Contribution Walkthrough */}
        {!error && currentView === 'walkthrough' && currentWalkthrough && selectedIssue && (
          <WalkthroughView
            walkthrough={currentWalkthrough}
            issue={selectedIssue}
            onBack={() => setCurrentView('report')}
          />
        )}

      </main>

      {/* AWS Architecture Modal */}
      {isArchitectureOpen && (
        <ArchitectureModal onClose={() => setIsArchitectureOpen(false)} />
      )}

      {/* How It Works Modal */}
      {isHowItWorksOpen && (
        <HowItWorksModal onClose={() => setIsHowItWorksOpen(false)} />
      )}

      {/* Global App Footer */}
      <footer className="border-t border-slate-900 bg-[#060910] py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-[9px] text-emerald-400 font-bold">
              PR
            </div>
            <span className="text-slate-400 font-semibold">FirstPR</span>
            <span className="text-slate-600">•</span>
            <span>WeMakeDevs × AWS Bharat Builds Tour</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-500">
            <button onClick={() => setIsHowItWorksOpen(true)} className="hover:text-slate-300 transition-colors cursor-pointer">
              How it works
            </button>
            <button onClick={() => setIsArchitectureOpen(true)} className="hover:text-slate-300 transition-colors cursor-pointer">
              AWS Architecture
            </button>
            <span>Verified Demo Mode</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
