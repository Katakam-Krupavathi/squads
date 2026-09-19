import React from 'react';
import { GroundedWalkthrough, IssueCandidate } from '../types';
import { X, Sparkles, CheckCircle2, FileCode, GitPullRequest, ArrowRight, ShieldCheck, Terminal, Compass, Layers, BookOpen } from 'lucide-react';

interface WalkthroughModalProps {
  walkthrough: GroundedWalkthrough | null;
  issue: IssueCandidate | null;
  onClose: () => void;
  isLoading: boolean;
}

export const WalkthroughModal: React.FC<WalkthroughModalProps> = ({ walkthrough, issue, onClose, isLoading }) => {
  if (!issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                Contribution Walkthrough
              </span>
              <span className="text-xs font-mono text-slate-400">
                Issue #{issue.number}
              </span>
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-mono font-medium">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                <span>Zero Hallucinated Paths</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight pt-1">
              {issue.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs sm:text-sm">
          
          {isLoading || !walkthrough ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-400 font-medium">Generating grounded contribution brief via Amazon Bedrock...</p>
            </div>
          ) : (
            <>
              {/* Issue Explained Simply */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Issue Explained Simply</span>
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {walkthrough.simple_explanation}
                </p>
              </div>

              {/* Why This Rating */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Difficulty Justification ({issue.difficulty.total_score}/100 — {issue.difficulty.category})
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {walkthrough.difficulty_justification}
                </p>
              </div>

              {/* Recommended File Reading Order Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Recommended File Reading Order ({walkthrough.files_to_read.length} Verified Files)</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
                    Validated In Repository Tree
                  </span>
                </div>

                <div className="space-y-2.5">
                  {walkthrough.files_to_read.map((fileStep) => (
                    <div
                      key={fileStep.order}
                      className={`p-3.5 rounded-xl border flex items-start space-x-3 transition-all ${
                        fileStep.is_target_file
                          ? 'bg-slate-800/90 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                          : 'bg-slate-950/60 border-slate-800/80'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 shrink-0 mt-0.5">
                        {fileStep.order}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <code className="text-xs font-bold text-emerald-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {fileStep.path}
                          </code>
                          {fileStep.is_target_file && (
                            <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                              Target Modification
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {fileStep.purpose}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Likely Change Location & Tests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Likely Change Location</span>
                  </span>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    {walkthrough.likely_change_location}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Test Validation Guidance</span>
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {walkthrough.test_validation_guidance}
                  </p>
                </div>
              </div>

              {/* Repository Conventions */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Repository Conventions & PR Standards</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Branch Naming:</span>
                    <code className="text-slate-300 font-mono text-[11px]">{walkthrough.repository_conventions.branch_naming}</code>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Commit Style:</span>
                    <span className="text-slate-300 font-medium">{walkthrough.repository_conventions.commit_style}</span>
                  </div>
                </div>

                {walkthrough.repository_conventions.pr_checklist && (
                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">PR Checklist:</span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono">
                      {walkthrough.repository_conventions.pr_checklist.map((chk, idx) => (
                        <li key={idx}>{chk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* AI Grounding Footer */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Orchestrated via <strong className="text-slate-300">{walkthrough.model_provider}</strong></span>
                </div>
                <span className="font-mono text-emerald-400">GROUNDING VALIDATED</span>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <span>Open Issue on GitHub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close Brief
          </button>
        </div>

      </div>
    </div>
  );
};
