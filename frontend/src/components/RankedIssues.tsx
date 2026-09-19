import React, { useState } from 'react';
import { IssueCandidate, DifficultyCategory } from '../types';
import { SignalRadar } from './SignalRadar';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Sparkles, FileText, ArrowRight, ShieldAlert } from 'lucide-react';

interface RankedIssuesProps {
  issues: IssueCandidate[];
  onSelectWalkthrough: (issue: IssueCandidate) => void;
}

export const RankedIssues: React.FC<RankedIssuesProps> = ({ issues, onSelectWalkthrough }) => {
  const [expandedIssues, setExpandedIssues] = useState<Record<number, boolean>>({});

  const toggleExpand = (issueNum: number) => {
    setExpandedIssues(prev => ({ ...prev, [issueNum]: !prev[issueNum] }));
  };

  const getCategoryBadge = (category: DifficultyCategory, isMislabelled: boolean) => {
    if (isMislabelled || category === 'Mislabelled') {
      return (
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold shadow-sm shadow-rose-950/40 animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>MISLABELLED (HIGH RISK)</span>
        </div>
      );
    }
    if (category === 'Genuinely Beginner') {
      return (
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>GENUINELY BEGINNER</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        <span>MODERATE DIFFICULTY</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>Ranked Issue Candidates</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {issues.length} Evaluated
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Difficulty independently calculated using 7 measurable repository signals.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {issues.map((issue) => {
          const isExpanded = !!expandedIssues[issue.number];
          const isMislabelled = issue.difficulty.is_mislabelled;

          return (
            <div
              key={issue.number}
              className={`rounded-2xl border transition-all ${
                isMislabelled
                  ? 'bg-slate-900/90 border-rose-500/40 mislabelled-glow hover:border-rose-500/60'
                  : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700/90 shadow-lg'
              }`}
            >
              {/* Main Card Header */}
              <div className="p-5 sm:p-6 space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getCategoryBadge(issue.difficulty.category, isMislabelled)}
                      <span className="text-xs font-mono text-slate-500 font-semibold">
                        #{issue.number}
                      </span>
                      {issue.labels.map((lbl, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700/60"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-lg font-bold text-white tracking-tight pt-1">
                      {issue.title}
                    </h4>
                  </div>

                  {/* Difficulty Score Box */}
                  <div className="sm:text-right shrink-0">
                    <div className="inline-block sm:block p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Difficulty Score</span>
                      <span className={`text-2xl font-black font-mono ${
                        issue.difficulty.total_score <= 35 ? 'text-emerald-400' :
                        issue.difficulty.total_score <= 65 ? 'text-amber-400' :
                        'text-rose-400'
                      }`}>
                        {issue.difficulty.total_score}
                        <span className="text-xs text-slate-600 font-normal">/100</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grounded Summary Explanation */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  <strong className="text-slate-200">FirstPR Verdict: </strong>
                  {issue.difficulty.summary_explanation}
                </p>

                {/* Key Signals Quick Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Social State</span>
                    <span className="font-bold text-slate-200 mt-0.5 block truncate font-mono text-[11px]">{issue.social_state}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Specification Quality</span>
                    <span className="font-bold text-slate-200 mt-0.5 block font-mono text-[11px]">{issue.specification_quality_score}% Clear</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Test Harness</span>
                    <span className="font-bold text-slate-200 mt-0.5 block truncate font-mono text-[11px]">{issue.test_availability}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Target File</span>
                    <span className="font-bold text-slate-200 mt-0.5 block truncate font-mono text-[11px]">
                      {issue.likely_affected_files[0] || 'Inferred from context'}
                    </span>
                  </div>
                </div>

                {/* Potential Blockers Callout */}
                {issue.potential_blockers.length > 0 && (
                  <div className={`p-3 rounded-xl border text-xs ${
                    isMislabelled
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                  }`}>
                    <span className="font-bold uppercase text-[10px] tracking-wider block mb-1">
                      Potential Contributor Blockers:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {issue.potential_blockers.map((blocker, bIdx) => (
                        <li key={bIdx}>{blocker}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions & Expand Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => toggleExpand(issue.number)}
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Signal Evidence' : 'Inspect 7-Signal Evidence'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center space-x-2.5">
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center space-x-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>

                    <button
                      onClick={() => onSelectWalkthrough(issue)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Contribution Walkthrough</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded 7-Signal Radar Section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800 animate-fadeIn">
                    <SignalRadar signals={issue.difficulty.signals} />
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
