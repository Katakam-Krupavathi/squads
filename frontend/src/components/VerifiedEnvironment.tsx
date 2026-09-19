import React, { useState } from 'react';
import { EnvironmentVerification, VerificationStep, StepStatus } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Clock, Terminal, Copy, Check, AlertCircle, Wrench } from 'lucide-react';

interface VerifiedEnvironmentProps {
  environment: EnvironmentVerification;
}

export const VerifiedEnvironment: React.FC<VerifiedEnvironmentProps> = ({ environment }) => {
  const [showLogs, setShowLogs] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const isVerified = environment.status === 'Verified';
  const isPartial = environment.status === 'Partially Verified';
  const isUnsupported = environment.status === 'Unsupported Stack';

  const getStatusBadge = () => {
    if (isVerified) {
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>VERIFIED</span>
        </div>
      );
    }
    if (isPartial) {
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>PARTIALLY VERIFIED</span>
        </div>
      );
    }
    if (isUnsupported) {
      return (
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>UNSUPPORTED STACK</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-bold text-xs">
        <XCircle className="w-4 h-4 text-rose-400" />
        <span>VERIFICATION FAILED</span>
      </div>
    );
  };

  const activeStep = environment.steps[selectedStepIndex] || environment.steps[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-6" data-testid="verified-environment">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Development environment
            </h2>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isVerified
              ? 'These commands were successfully executed in an isolated sandbox. (Demo verification result)'
              : isPartial
              ? 'Dependency installation succeeded, but build step reported engine constraints.'
              : isUnsupported
              ? 'Bare-metal embedded target is unsupported for automated cloud execution.'
              : 'Setup commands failed to execute cleanly.'}
          </p>
        </div>

        {/* Execution Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Execution Duration</span>
            <span className="font-bold text-slate-200">{(environment.total_duration_ms / 1000).toFixed(2)}s</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Execution Layer</span>
            <span className="font-bold text-amber-300">AWS ECS Fargate</span>
          </div>
        </div>
      </div>

      {/* Grid: Commands & Status Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Commands List (Left) */}
        <div className="lg:col-span-6 space-y-3 font-mono text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-sans tracking-wider block mb-1">
            Derived Setup Pipeline:
          </span>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] uppercase font-sans text-slate-500 block font-semibold">Runtime</span>
            <span className="text-slate-200 font-bold">{environment.runtime}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] uppercase font-sans text-slate-500 block font-semibold">Package Manager</span>
            <span className="text-slate-200 font-bold">{environment.package_manager}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] uppercase font-sans text-slate-500 block font-semibold">Install Command</span>
            <span className="text-emerald-300 font-bold">$ {environment.install_command || 'N/A'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] uppercase font-sans text-slate-500 block font-semibold">Build Command</span>
            <span className="text-teal-300 font-bold">$ {environment.build_command || 'N/A'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <span className="text-[10px] uppercase font-sans text-slate-500 block font-semibold">Test Command</span>
            <span className="text-cyan-300 font-bold">$ {environment.test_command || 'N/A'}</span>
          </div>
        </div>

        {/* Status Timeline & Diagnostic Card (Right) */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Sandbox Verification Timeline:
          </span>

          {environment.steps.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
              No sandbox steps available for this target environment.
            </div>
          ) : (
            <div className="space-y-2.5">
              {environment.steps.map((step, idx) => {
                const isPassed = step.status === 'completed';
                const isFailed = step.status === 'failed';
                const isSkipped = step.status === 'skipped';

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                      isPassed
                        ? 'bg-slate-950/60 border-emerald-500/30 text-slate-200'
                        : isFailed
                        ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                        : 'bg-slate-950/40 border-slate-800/40 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isFailed && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                      {isSkipped && <Clock className="w-4 h-4 text-slate-600 shrink-0" />}
                      <div>
                        <span className="font-bold uppercase tracking-wider block">
                          {step.name} {isPassed ? 'completed' : isFailed ? 'failed' : 'skipped'}
                        </span>
                        <code className="text-[11px] font-mono opacity-80">$ {step.command}</code>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono">
                      {(step.duration_ms / 1000).toFixed(2)}s
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Error Diagnostics for Partial / Failed Environments (Section 30) */}
          {environment.error_summary && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Diagnostic Error Summary</span>
              </div>
              <p className="text-rose-200 leading-relaxed font-mono text-[11px]">
                {environment.error_summary}
              </p>
              {environment.recommended_fix && (
                <div className="pt-2 border-t border-rose-900/40 text-slate-300 flex items-start space-x-2">
                  <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[11px]">
                    <strong className="text-amber-300">Recommended Next Step: </strong>
                    {environment.recommended_fix}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Toggle Terminal Logs Button */}
          {environment.steps.length > 0 && (
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>{showLogs ? 'Hide Verification Logs' : 'View Verification Logs (stdout/stderr)'}</span>
            </button>
          )}

        </div>

      </div>

      {/* Expandable Terminal Log Viewer (Section 29) */}
      {showLogs && activeStep && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-fadeIn">
          {/* Terminal Tabs */}
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {environment.steps.map((step, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setSelectedStepIndex(sIdx)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    selectedStepIndex === sIdx
                      ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {step.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopy(`${activeStep.stdout}\n${activeStep.stderr}`)}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Logs'}</span>
            </button>
          </div>

          {/* Terminal Output */}
          <div className="p-4 font-mono text-xs text-slate-300 max-h-[300px] overflow-y-auto space-y-2 bg-[#060910]">
            <div className="text-slate-500 font-semibold">$ {activeStep.command}</div>
            {activeStep.stdout && (
              <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed font-mono">
                {activeStep.stdout}
              </pre>
            )}
            {activeStep.stderr && (
              <pre className="whitespace-pre-wrap text-rose-400 leading-relaxed font-mono font-semibold">
                {activeStep.stderr}
              </pre>
            )}
            <div className="text-slate-600 text-[10px] pt-2 border-t border-slate-900">
              # Step duration: {(activeStep.duration_ms / 1000).toFixed(2)}s | Exit code: {activeStep.exit_code ?? 0}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
