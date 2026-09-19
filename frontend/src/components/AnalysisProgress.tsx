import React from 'react';
import { CheckCircle2, Loader2, AlertCircle, Clock, ArrowRight, ShieldCheck, FileCode, Terminal, Layers } from 'lucide-react';
import { AnalysisJob, StepStatus } from '../types';

interface AnalysisProgressProps {
  job: AnalysisJob;
  onViewReport: () => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ job, onViewReport }) => {
  const isComplete = job.status === 'COMPLETE' || job.progress_percentage === 100;

  const getStageIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-teal-400 animate-spin shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600 shrink-0" />;
    }
  };

  const repoName = job.repository_url.replace('https://github.com/', '').replace(/\/$/, '');

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6" data-testid="analysis-pipeline">
      
      {/* Top Header Card */}
      <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              <span className="text-xs font-mono font-semibold text-teal-400 uppercase tracking-wider">
                Live Pipeline Active
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Analyzing {repoName}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              FirstPR is mapping the repository structure and evaluating beginner issues.
            </p>
          </div>

          <div className="flex items-center space-x-4 sm:text-right">
            <div>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                {job.progress_percentage}%
              </span>
              <p className="text-[11px] text-slate-500 font-mono">Job: {job.job_id.slice(0, 12)}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 my-5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-emerald-500"
            style={{ width: `${Math.max(8, job.progress_percentage)}%` }}
          ></div>
        </div>
      </div>

      {/* Grid: 9 Stages (Left) + Side Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 9 Vertical Pipeline Stages */}
        <div className="lg:col-span-8 space-y-2.5">
          {job.stages.map((stage) => {
            const isCurrent = stage.status === 'running';
            const isDone = stage.status === 'completed';

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-slate-900 border-teal-500/50 shadow-md shadow-teal-950/30'
                    : isDone
                    ? 'bg-[#0e1422]/70 border-slate-800/80'
                    : 'bg-slate-950/40 border-slate-800/40 opacity-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getStageIcon(stage.status)}
                  <div>
                    <span className={`text-xs font-semibold ${
                      isCurrent ? 'text-white' : isDone ? 'text-slate-200' : 'text-slate-500'
                    }`}>
                      {stage.name}
                    </span>
                    {stage.detail && (
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {stage.detail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {isDone && stage.duration_label && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                      {stage.duration_label}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-950/50 px-2 py-0.5 rounded border border-teal-800/40 animate-pulse">
                      Running...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Side Panel (Section 15) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Analysis Metrics Sidebar Card */}
          <div className="p-5 rounded-2xl bg-[#0e1422] border border-slate-800 space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspection Metrics</span>
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Files inspected</span>
                <span className="font-mono font-bold text-slate-200">
                  {job.metrics_sidebar?.files_inspected || 146}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Issues evaluated</span>
                <span className="font-mono font-bold text-slate-200">
                  {job.metrics_sidebar?.issues_evaluated || 7}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Tests detected</span>
                <span className="font-mono font-bold text-slate-200">
                  {job.metrics_sidebar?.tests_detected || 48}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Analysis mode</span>
                <span className="font-mono font-semibold text-emerald-400 text-[11px]">
                  Cached demo
                </span>
              </div>
            </div>

            {/* Likely Setup Commands */}
            <div className="pt-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Derived Commands:
              </span>
              <div className="space-y-1">
                {(job.metrics_sidebar?.likely_setup || ['npm ci', 'npm test']).map((cmd, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                    $ {cmd}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Completion Summary Card (Section 16) */}
          {isComplete && (
            <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/40 shadow-xl space-y-3.5 animate-fadeIn">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Analysis Complete</span>
              </div>

              <ul className="text-xs text-slate-300 space-y-1 font-mono text-[11px]">
                <li className="flex items-center space-x-1.5">
                  <span className="text-emerald-400">•</span>
                  <span>Candidate issues evaluated</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-emerald-400">•</span>
                  <span>Genuinely beginner issues found</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-rose-400">•</span>
                  <span>Mislabelled issues exposed</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <span className="text-teal-400">•</span>
                  <span>Environment verified</span>
                </li>
              </ul>

              <button
                onClick={onViewReport}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-950/50 cursor-pointer"
              >
                <span>View FirstPR Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
