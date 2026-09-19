import React from 'react';
import { RepositoryAnalysis } from '../types';
import { Star, GitFork, GitBranch, ExternalLink, Cloud, RefreshCw, CheckCircle2, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface ReportHeaderProps {
  analysis: RepositoryAnalysis;
  onRerun: () => void;
  onOpenArchitecture: () => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ analysis, onRerun, onOpenArchitecture }) => {
  const { summary, environment, metrics_summary } = analysis;

  return (
    <div className="space-y-6" data-testid="report-header">
      
      {/* Top Header Card */}
      <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {summary.full_name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {summary.stack.primary_language}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700/60">
                Cached demo
              </span>
            </div>

            <p className="text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
              {summary.description || 'Open source software repository'}
            </p>

            {/* Language & Framework Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              {summary.stack.frameworks.map((fw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 font-mono text-[11px]"
                >
                  {fw}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 font-mono text-[11px]">
                {summary.stack.package_manager}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onRerun}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-run</span>
            </button>

            <a
              href={analysis.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View on GitHub</span>
            </a>

            <button
              onClick={onOpenArchitecture}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
              <span>AWS Architecture</span>
            </button>
          </div>
        </div>

        {/* GitHub Stats Strip */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center space-x-1.5 font-mono">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span className="text-slate-200">{summary.stars.toLocaleString()}</span>
            <span>stars</span>
          </div>
          <div className="flex items-center space-x-1.5 font-mono">
            <GitFork className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-slate-200">{summary.forks.toLocaleString()}</span>
            <span>forks</span>
          </div>
          <div className="flex items-center space-x-1.5 font-mono">
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300">{summary.default_branch}</span>
          </div>
          <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-500 ml-auto">
            <span>Commit:</span>
            <code className="text-slate-400">{summary.latest_commit_sha || 'main'}</code>
          </div>
        </div>

      </div>

      {/* 4-Metric Summary Strip (Section 18) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-[#0e1422] border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Issues Analyzed
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-mono">
              {metrics_summary.issues_analyzed_count}
            </span>
            <span className="text-xs text-slate-400">candidates</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1422] border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Good Candidates
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {metrics_summary.good_candidates_count}
            </span>
            <span className="text-xs text-slate-400">verified beginner</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1422] border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Mislabelled Issues
          </span>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-black font-mono ${
              metrics_summary.mislabelled_count > 0 ? 'text-rose-400' : 'text-slate-400'
            }`}>
              {metrics_summary.mislabelled_count}
            </span>
            <span className="text-xs text-slate-400">high-risk trapped</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1422] border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Environment Setup
          </span>
          <div className="flex items-baseline space-x-2">
            <span className={`text-base font-bold font-mono truncate ${
              environment.status === 'Verified' ? 'text-emerald-400' :
              environment.status === 'Partially Verified' ? 'text-amber-400' :
              'text-rose-400'
            }`}>
              {environment.status}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({metrics_summary.setup_confidence_score}%)
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
