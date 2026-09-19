import React from 'react';
import { CheckCircle2, Loader2, AlertCircle, Clock, ShieldCheck, Terminal } from 'lucide-react';
import { AnalysisJob, StepStatus } from '../types';

interface AnalysisProgressProps {
  job: AnalysisJob;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ job }) => {
  const getStageIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-teal-400 animate-spin shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      default:
        return <Clock className="w-5 h-5 text-slate-600 shrink-0" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Live Pipeline Active
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Analyzing Repository Pipeline
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1 truncate max-w-md">
              {job.repository_url}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">
              {job.progress_percentage}%
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Job: {job.job_id}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 my-6 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500"
            style={{ width: `${Math.max(5, job.progress_percentage)}%` }}
          ></div>
        </div>

        {/* Pipeline Stages Checklist */}
        <div className="space-y-3.5 mt-6">
          {job.stages.map((stage, idx) => {
            const isCurrent = stage.status === 'running';
            const isDone = stage.status === 'completed';
            
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-800/80 border-teal-500/50 shadow-md shadow-teal-950/30'
                    : isDone
                    ? 'bg-slate-900/50 border-slate-800/80'
                    : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getStageIcon(stage.status)}
                  <div>
                    <span className={`text-sm font-semibold ${isCurrent ? 'text-white' : isDone ? 'text-slate-200' : 'text-slate-400'}`}>
                      {stage.name}
                    </span>
                    {stage.message && (
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {stage.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase ${
                      stage.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : stage.status === 'running'
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 animate-pulse'
                        : stage.status === 'failed'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* AWS Sandbox Assurance Note */}
        <div className="mt-8 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Isolated Container Execution on <strong className="text-slate-200">AWS ECS / Fargate</strong></span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
            ZERO SECRETS EXPOSED
          </span>
        </div>

      </div>
    </div>
  );
};
