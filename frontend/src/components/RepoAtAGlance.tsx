import React from 'react';
import { Star, GitFork, AlertCircle, FileCode, CheckCircle, Layers, Terminal, Box, GitBranch } from 'lucide-react';
import { RepositorySummary } from '../types';

interface RepoAtAGlanceProps {
  summary: RepositorySummary;
}

export const RepoAtAGlance: React.FC<RepoAtAGlanceProps> = ({ summary }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {summary.full_name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {summary.stack.primary_language}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {summary.description || 'Open source software repository'}
          </p>
        </div>

        {/* GitHub Stats */}
        <div className="flex items-center space-x-3 text-xs font-medium text-slate-300">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>{summary.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <GitFork className="w-3.5 h-3.5 text-teal-400" />
            <span>{summary.forks.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono">
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span>{summary.default_branch}</span>
          </div>
        </div>
      </div>

      {/* Grid of Key Repo Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Package Manager</span>
          <div className="flex items-center space-x-2 mt-1.5">
            <Box className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-slate-200 font-mono">{summary.stack.package_manager}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Test Framework</span>
          <div className="flex items-center space-x-2 mt-1.5">
            <CheckCircle className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-bold text-slate-200 font-mono">{summary.stack.test_framework || 'pytest / npm'}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Entry Points</span>
          <div className="flex items-center space-x-2 mt-1.5 truncate">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200 font-mono truncate">
              {summary.stack.entry_points[0] || 'src/index.js'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/70">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Analyzed Tree</span>
          <div className="flex items-center space-x-2 mt-1.5">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-slate-200 font-mono">{summary.total_files_analyzed} Files</span>
          </div>
        </div>
      </div>

      {/* Detected Frameworks & Architecture Overview */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Detected Frameworks:</span>
          {summary.stack.frameworks.map((fw, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
            >
              {fw}
            </span>
          ))}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Architecture Overview: </strong>
          {summary.architecture_overview}
        </p>
      </div>

    </div>
  );
};
