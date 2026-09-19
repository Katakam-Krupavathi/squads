import React, { useState, useMemo } from 'react';
import { IssueCandidate, IssueFilter, IssueSort } from '../types';
import { SignalRadar } from './SignalRadar';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Sparkles, ArrowRight, ShieldAlert, Filter, ArrowUpDown } from 'lucide-react';

interface RankedIssuesProps {
  issues: IssueCandidate[];
  onSelectWalkthrough: (issue: IssueCandidate) => void;
}

export const RankedIssues: React.FC<RankedIssuesProps> = ({ issues, onSelectWalkthrough }) => {
  const [filter, setFilter] = useState<IssueFilter>('all');
  const [sort, setSort] = useState<IssueSort>('best_match');
  const [expandedIssues, setExpandedIssues] = useState<Record<number, boolean>>({});

  const toggleExpand = (issueNum: number) => {
    setExpandedIssues(prev => ({ ...prev, [issueNum]: !prev[issueNum] }));
  };

  // Filter & Sort Logic
  const filteredIssues = useMemo(() => {
    let result = [...issues];

    if (filter === 'beginner') {
      result = result.filter(i => i.difficulty.category === 'Genuinely Beginner');
    } else if (filter === 'moderate') {
      result = result.filter(i => i.difficulty.category === 'Moderate');
    } else if (filter === 'mislabelled') {
      result = result.filter(i => i.difficulty.is_mislabelled || i.difficulty.category === 'Mislabelled');
    } else if (filter === 'available') {
      result = result.filter(i => i.social_state === 'Available');
    }

    if (sort === 'lowest_difficulty') {
      result.sort((a, b) => a.difficulty.total_score - b.difficulty.total_score);
    } else if (sort === 'newest') {
      result.sort((a, b) => b.number - a.number);
    } else {
      // Best match: Beginner first, then Moderate, then Mislabelled
      result.sort((a, b) => {
        if (a.difficulty.is_mislabelled && !b.difficulty.is_mislabelled) return 1;
        if (!a.difficulty.is_mislabelled && b.difficulty.is_mislabelled) return -1;
        return a.difficulty.total_score - b.difficulty.total_score;
      });
    }

    return result;
  }, [issues, filter, sort]);

  const mislabelledIssue = issues.find(i => i.difficulty.is_mislabelled);

  return (
    <div className="space-y-6" data-testid="ranked-issues-section">
      
      {/* Section Header & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Best first contribution opportunities</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {filteredIssues.length} of {issues.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked from repository evidence — not just GitHub labels.
          </p>
        </div>

        {/* Filter Pills & Sort Select */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="inline-flex rounded-xl bg-[#0e1422] border border-slate-800 p-1">
            {(['all', 'beginner', 'moderate', 'mislabelled', 'available'] as IssueFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                  filter === f
                    ? 'bg-emerald-500/15 text-emerald-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#0e1422] border border-slate-800 text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as IssueSort)}
              className="bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="best_match" className="bg-slate-900 text-slate-200">Best match</option>
              <option value="lowest_difficulty" className="bg-slate-900 text-slate-200">Lowest difficulty</option>
              <option value="newest" className="bg-slate-900 text-slate-200">Newest issue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mislabelled Spotlight Warning Banner (Section 25 - Star Moment) */}
      {mislabelledIssue && filter !== 'beginner' && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-rose-950/20 border border-rose-500/40 shadow-xl space-y-3 mislabelled-glow animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Mislabelled Issue Spotlight</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800/60">
              Score: {mislabelledIssue.difficulty.total_score}/100
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-slate-300">
              <span className="text-slate-500 block text-[10px]">GitHub says:</span>
              <strong className="text-amber-300">"good first issue"</strong>
            </div>

            <span className="hidden sm:inline text-slate-600 font-bold">vs</span>

            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 font-mono text-rose-300">
              <span className="text-rose-400 block text-[10px]">FirstPR evidence says:</span>
              <strong className="text-rose-300">MISLABELLED (HIGH RISK)</strong>
            </div>
          </div>

          {mislabelledIssue.difficulty.mislabelled_reasons && (
            <div className="pt-2 border-t border-rose-900/40">
              <span className="text-[11px] font-bold text-slate-300 block mb-1">
                Why FirstPR challenges the maintainer label:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-400 font-mono">
                {mislabelledIssue.difficulty.mislabelled_reasons.map((reason, rIdx) => (
                  <li key={rIdx} className="flex items-start space-x-1.5">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span className="leading-tight">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Issues Cards List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => {
          const isExpanded = !!expandedIssues[issue.number];
          const isMislabelled = issue.difficulty.is_mislabelled;
          const isBeginner = issue.difficulty.category === 'Genuinely Beginner';

          return (
            <div
              key={issue.number}
              data-testid="issue-card"
              className={`rounded-2xl border transition-all ${
                isMislabelled
                  ? 'bg-[#0e1422] border-rose-500/40 hover:border-rose-500/60 shadow-lg'
                  : isBeginner
                  ? 'bg-[#0e1422] border-emerald-500/30 hover:border-emerald-500/50 shadow-lg'
                  : 'bg-[#0e1422] border-slate-800/90 hover:border-slate-700/90 shadow-lg'
              }`}
            >
              <div className="p-5 sm:p-6 space-y-4">
                
                {/* Header Row: Badges, Title, Score */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isMislabelled ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono flex items-center space-x-1">
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                          <span>MISLABELLED</span>
                        </span>
                      ) : isBeginner ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>GENUINELY BEGINNER</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>MODERATE</span>
                        </span>
                      )}

                      <span className="text-xs font-mono text-slate-500 font-semibold">
                        #{issue.number}
                      </span>

                      {issue.labels.map((lbl, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight pt-1">
                      {issue.title}
                    </h3>
                  </div>

                  {/* Score Callout */}
                  <div className="sm:text-right shrink-0">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[90px]">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Score</span>
                      <span className={`text-2xl font-black font-mono ${
                        isBeginner ? 'text-emerald-400' : isMislabelled ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {issue.difficulty.total_score}
                        <span className="text-xs text-slate-600 font-normal">/100</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plain-English Interpretation */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/70">
                  <strong className="text-slate-200">FirstPR Interpretation: </strong>
                  {issue.difficulty.summary_explanation}
                </p>

                {/* Compact 7-Signal Score Matrix (Section 23) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-[11px]">
                  {Object.values(issue.difficulty.signals).map((sig, sIdx) => (
                    <div key={sIdx} className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/60 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block truncate">
                        {sig.name.replace('Structural ', '').replace('Specification ', 'Spec ')}
                      </span>
                      <span className={`font-mono font-bold mt-0.5 block ${
                        sig.rating_label === 'Low' || sig.rating_label === 'Strong' || sig.rating_label === 'Excellent' || sig.rating_label === 'Available' || sig.rating_label === 'Minimal'
                          ? 'text-emerald-400'
                          : sig.rating_label === 'Moderate'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}>
                        {sig.rating_label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Actions & Expand Details */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => toggleExpand(issue.number)}
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Detailed Evidence' : 'Why this score? (Evidence)'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center space-x-2.5">
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>

                    <button
                      onClick={() => onSelectWalkthrough(issue)}
                      data-testid="walkthrough-button"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start this issue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed 7-Signal Evidence (Section 24) */}
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
