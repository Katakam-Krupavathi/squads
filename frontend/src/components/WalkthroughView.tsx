import React from 'react';
import { GroundedWalkthrough, IssueCandidate } from '../types';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Compass,
  BookOpen,
  FileCode,
  CheckCircle2,
  ListOrdered,
  Sparkles,
  GitPullRequest,
  Check,
  Terminal,
  Layers,
  HelpCircle
} from 'lucide-react';

interface WalkthroughViewProps {
  walkthrough: GroundedWalkthrough;
  issue: IssueCandidate;
  onBack: () => void;
}

export const WalkthroughView: React.FC<WalkthroughViewProps> = ({
  walkthrough,
  issue,
  onBack
}) => {
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 animate-fadeIn" data-testid="walkthrough-page">
      
      {/* Top Navigation & Back Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Repository Report</span>
        </button>

        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <span>Open on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Walkthrough Header (Section 32) */}
      <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-xl backdrop-blur-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                Contribution Brief
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold">
                Issue #{issue.number}
              </span>
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-mono font-medium">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                <span>Zero Hallucinated Paths</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
              {issue.title}
            </h1>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Difficulty</span>
              <span className="text-xl font-black font-mono text-emerald-400 block mt-0.5">
                {issue.difficulty.total_score}
                <span className="text-xs text-slate-600 font-normal"> / 100</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-300 uppercase block font-mono">
                {issue.difficulty.category}
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Scope Bar */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
          <span className="text-slate-500 uppercase font-sans font-semibold text-[10px]">Estimated Scope:</span>
          <span>{walkthrough.estimated_scope.files_count} files</span>
          <span className="text-slate-600">•</span>
          <span>{walkthrough.estimated_scope.test_count} regression test</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-300 font-sans">{walkthrough.estimated_scope.scope_description}</span>
        </div>

      </div>

      {/* "What is this issue asking?" (Section 33) */}
      <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>What is this issue asking?</span>
        </div>
        <p className="text-slate-200 text-sm leading-relaxed">
          {walkthrough.simple_explanation}
        </p>
      </div>

      {/* Reading Order Timeline (Section 34) */}
      <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Read these files in order</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
            {walkthrough.validated_file_count} Files Validated Against Git Tree
          </span>
        </div>

        <div className="space-y-4">
          {walkthrough.files_to_read.map((step) => (
            <div
              key={step.order}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start gap-3.5 transition-all ${
                step.is_target_file
                  ? 'bg-slate-900 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 shrink-0 mt-0.5">
                {step.order}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    {step.phase_label}
                  </span>
                  <code className="text-xs font-bold text-slate-100 font-mono bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                    {step.path}
                  </code>
                  {step.is_target_file && (
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-sans">
                      Primary Target
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.purpose}
                </p>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  <strong className="text-slate-300">Why it matters: </strong>
                  {step.why_it_matters}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Likely Change Location & Contribution Plan (Sections 35 & 36) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Likely Change Location (Left) */}
        <div className="lg:col-span-5 bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
            <FileCode className="w-4 h-4" />
            <span>Most likely change location</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[10px] uppercase font-sans font-bold">Target Module</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50 font-sans font-semibold">
                {walkthrough.likely_change_location.confidence}
              </span>
            </div>
            <div className="text-slate-100 font-bold">{walkthrough.likely_change_location.file}</div>
            <div className="text-teal-300 font-medium">{walkthrough.likely_change_location.symbol}</div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Reason: </strong>
            {walkthrough.likely_change_location.reason}
          </p>

          {/* Test Guidance (Section 37) */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tests that matter</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="text-slate-400 text-[11px]">Focused Test:</div>
              <code className="text-emerald-300 block bg-slate-900 p-1.5 rounded">$ {walkthrough.test_commands.focused_command}</code>
              <div className="text-slate-400 text-[11px] pt-1">Full Suite:</div>
              <code className="text-slate-300 block bg-slate-900 p-1.5 rounded">$ {walkthrough.test_commands.full_suite_command}</code>
            </div>
          </div>
        </div>

        {/* 6-Step Contribution Plan (Right - Section 36) */}
        <div className="lg:col-span-7 bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ListOrdered className="w-4 h-4" />
            <span>A reasonable contribution plan</span>
          </div>

          <div className="space-y-3 text-xs">
            {walkthrough.contribution_plan.map((plan) => (
              <div
                key={plan.step_number}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-400">
                    {plan.step_number}
                  </span>
                  <span className="font-bold text-slate-200">{plan.title}</span>
                </div>
                <p className="text-slate-400 pl-7 leading-relaxed">{plan.detail}</p>
                {plan.command && (
                  <div className="pl-7 pt-1">
                    <code className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 font-mono text-[11px] border border-slate-800">
                      $ {plan.command}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Before Opening PR & Conventions (Section 38) */}
      <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-slate-300 font-bold text-sm">
          <GitPullRequest className="w-4 h-4 text-teal-400" />
          <span>Before opening the PR (Repository Conventions)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              PR Checklist Standards:
            </span>
            <div className="space-y-2">
              {walkthrough.before_opening_pr_checklist.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                    {item.source}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conventions Summary */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Style & Branching Rules:
            </span>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Branch Naming:</span>
                <code className="text-emerald-300 font-mono">{walkthrough.repository_conventions.branch_naming}</code>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Commit Style:</span>
                <span className="text-slate-200 font-semibold">{walkthrough.repository_conventions.commit_style}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Linter & Formatter:</span>
                <span className="text-slate-200">{walkthrough.repository_conventions.lint_tool} / {walkthrough.repository_conventions.formatting_tool}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why FirstPR Chose This Issue (Section 39) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/40 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Why this is a strong first contribution</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {walkthrough.why_firstpr_chose_this.map((reason, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-slate-200 text-xs font-medium"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{reason}</span>
            </span>
          ))}
        </div>
      </div>

      {/* AI Grounding Footer */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-mono">
        <span>Grounded via <strong className="text-slate-200">{walkthrough.model_provider}</strong></span>
        <span className="text-emerald-400">STATUS: 100% REPO VERIFIED</span>
      </div>

    </div>
  );
};
