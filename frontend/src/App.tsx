import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RepoInput } from './components/RepoInput';
import { AnalysisProgress } from './components/AnalysisProgress';
import { RepoAtAGlance } from './components/RepoAtAGlance';
import { RankedIssues } from './components/RankedIssues';
import { VerifiedEnvironment } from './components/VerifiedEnvironment';
import { WalkthroughModal } from './components/WalkthroughModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import {
  RepositoryAnalysis,
  AnalysisJob,
  IssueCandidate,
  GroundedWalkthrough
} from './types';
import {
  fetchDemoRepositories,
  submitAnalysis,
  fetchJobStatus,
  fetchReport,
  fetchWalkthrough
} from './services/api';
import { Sparkles, RefreshCw, ArrowLeft, GitPullRequest } from 'lucide-react';

export const App: React.FC = () => {
  const [demoRepos, setDemoRepos] = useState<RepositoryAnalysis[]>([]);
  const [currentJob, setCurrentJob] = useState<AnalysisJob | null>(null);
  const [currentReport, setCurrentReport] = useState<RepositoryAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [selectedIssue, setSelectedIssue] = useState<IssueCandidate | null>(null);
  const [walkthrough, setWalkthrough] = useState<GroundedWalkthrough | null>(null);
  const [isWalkthroughLoading, setIsWalkthroughLoading] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchDemoRepositories().then(setDemoRepos).catch(console.error);
  }, []);

  const handleStartAnalysis = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentReport(null);

    try {
      const job = await submitAnalysis(url);
      setCurrentJob(job);

      if (job.status === 'COMPLETE' && job.report_id) {
        const report = await fetchReport(job.report_id);
        setCurrentReport(report);
        setIsLoading(false);
      } else {
        // Poll for completion
        pollJob(job.job_id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit analysis');
      setIsLoading(false);
    }
  };

  const pollJob = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const updatedJob = await fetchJobStatus(jobId);
        setCurrentJob(updatedJob);

        if (updatedJob.status === 'COMPLETE' && updatedJob.report_id) {
          clearInterval(interval);
          const report = await fetchReport(updatedJob.report_id);
          setCurrentReport(report);
          setIsLoading(false);
        } else if (updatedJob.status === 'FAILED') {
          clearInterval(interval);
          setError(updatedJob.error || 'Repository analysis failed.');
          setIsLoading(false);
        }
      } catch (err) {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleSelectWalkthrough = async (issue: IssueCandidate) => {
    if (!currentReport) return;
    setSelectedIssue(issue);
    setWalkthrough(null);
    setIsWalkthroughLoading(true);

    try {
      const wt = await fetchWalkthrough(currentReport.id, issue.number);
      setWalkthrough(wt);
    } catch (err) {
      console.error('Error fetching walkthrough:', err);
    } finally {
      setIsWalkthroughLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentJob(null);
    setCurrentReport(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      <Navbar
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error Alert */}
        {error && (
          <div className="max-w-3xl mx-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold underline cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Screen 1: Input (When no job and no report) */}
        {!currentJob && !currentReport && (
          <RepoInput
            onAnalyze={handleStartAnalysis}
            isLoading={isLoading}
            demoRepos={demoRepos}
          />
        )}

        {/* Screen 2: Analysis In Progress */}
        {currentJob && !currentReport && (
          <AnalysisProgress job={currentJob} />
        )}

        {/* Screen 3: Repository Report */}
        {currentReport && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Bar for Report Screen */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
              <button
                onClick={handleReset}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Analyze Another Repository</span>
              </button>

              <div className="flex items-center space-x-3 text-xs">
                {currentReport.is_cached && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
                    ⚡ Pre-Verified Cache ({new Date(currentReport.cached_timestamp || '').toLocaleTimeString()})
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                  Analysis Cost: ${currentReport.cost_estimate_usd}
                </span>
              </div>
            </div>

            {/* Screen 3A: Repository At A Glance */}
            <RepoAtAGlance summary={currentReport.summary} />

            {/* Screen 3B: Ranked Beginner Issues (With Mislabelled Spotlight!) */}
            <RankedIssues
              issues={currentReport.ranked_issues}
              onSelectWalkthrough={handleSelectWalkthrough}
            />

            {/* Screen 3C: Verified Environment (Real Sandbox Execution Logs!) */}
            <VerifiedEnvironment environment={currentReport.environment} />

          </div>
        )}

      </main>

      {/* Screen 4: Grounded Contribution Walkthrough Modal */}
      {selectedIssue && (
        <WalkthroughModal
          walkthrough={walkthrough}
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          isLoading={isWalkthroughLoading}
        />
      )}

      {/* AWS Architecture Modal */}
      {isArchitectureOpen && (
        <ArchitectureModal onClose={() => setIsArchitectureOpen(false)} />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <GitPullRequest className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-semibold">FirstPR</span>
            <span>—</span>
            <span>WeMakeDevs × AWS Bharat Builds Tour</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Engineered with Amazon Bedrock, AWS ECS/Fargate, Step Functions, and React.
          </p>
        </div>
      </footer>
    </div>
  );
};
