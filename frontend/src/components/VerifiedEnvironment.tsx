import React, { useState } from 'react';
import { EnvironmentVerification, VerificationStep, StepStatus } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Clock, Terminal, ChevronRight, Cpu, Copy, Check } from 'lucide-react';

interface VerifiedEnvironmentProps {
  environment: EnvironmentVerification;
}

export const VerifiedEnvironment: React.FC<VerifiedEnvironmentProps> = ({ environment }) => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs shadow-sm shadow-emerald-950/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ENVIRONMENT VERIFIED</span>
          </div>
        );
      case 'Partially Verified':
        return (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>PARTIALLY VERIFIED</span>
          </div>
        );
      case 'Timed Out':
        return (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-300 font-bold text-xs">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>EXECUTION TIMED OUT</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-bold text-xs">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>VERIFICATION FAILED</span>
          </div>
        );
    }
  };

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const activeStep = environment.steps[selectedStepIndex] || environment.steps[0];

  const handleCopyLogs = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Verified Sandbox Environment
            </h3>
            {getStatusBadge(environment.status)}
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Actual commands executed inside an isolated container with zero credentials exposed.
          </p>
        </div>

        {/* Runtime & Sandbox Stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Runtime</span>
            <span className="font-bold text-emerald-400">{environment.runtime}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Duration</span>
            <span className="font-bold text-slate-200">{(environment.total_duration_ms / 1000).toFixed(2)}s</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block font-sans">Sandbox Provider</span>
            <span className="font-bold text-amber-300">{environment.sandbox_provider}</span>
          </div>
        </div>
      </div>

      {/* Steps Selector & Terminal Log Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Step Tabs (Left) */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Execution Steps:
          </span>

          {environment.steps.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
              No executable steps derived.
            </div>
          ) : (
            environment.steps.map((step, idx) => {
              const isSelected = selectedStepIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedStepIndex(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/50 shadow-md shadow-emerald-950/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      {getStepIcon(step.status)}
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        {step.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {(step.duration_ms / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-1.5 truncate">
                    $ {step.command}
                  </p>
                </button>
              );
            })
          )}

          {/* Sandbox Security Guarantee Pill */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[11px] text-slate-400 space-y-1 mt-4">
            <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Container Constraints:</span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">
              • Limit: {environment.cpu_limit} / {environment.memory_limit} <br />
              • Timeout: {environment.timeout_seconds}s hard limit <br />
              • No inbound network access
            </p>
          </div>
        </div>

        {/* Terminal Log Output (Right) */}
        <div className="lg:col-span-8">
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[280px]">
            
            {/* Terminal Header */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs font-mono text-slate-400 ml-2 font-medium">
                  {activeStep ? `$ ${activeStep.command}` : 'Sandbox Terminal'}
                </span>
              </div>

              {activeStep && (
                <button
                  onClick={() => handleCopyLogs(`${activeStep.stdout}\n${activeStep.stderr}`)}
                  className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Logs'}</span>
                </button>
              )}
            </div>

            {/* Terminal Output Body */}
            <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto flex-1 space-y-2 bg-[#080c14]">
              {activeStep ? (
                <>
                  <div className="text-slate-500">
                    # Executing in ephemeral container (AWS ECS Fargate Task)
                  </div>
                  <div className="text-emerald-400 font-semibold">
                    $ {activeStep.command}
                  </div>
                  {activeStep.stdout && (
                    <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                      {activeStep.stdout}
                    </pre>
                  )}
                  {activeStep.stderr && (
                    <pre className="whitespace-pre-wrap text-rose-400 leading-relaxed font-semibold">
                      {activeStep.stderr}
                    </pre>
                  )}
                  <div className="text-slate-500 pt-2 border-t border-slate-900 text-[10px]">
                    # Process exited with code {activeStep.exit_code ?? 0} in {(activeStep.duration_ms / 1000).toFixed(2)}s
                  </div>
                </>
              ) : (
                <div className="text-slate-500">No output logs recorded.</div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
