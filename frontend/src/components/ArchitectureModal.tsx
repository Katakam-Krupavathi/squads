import React from 'react';
import { X, Cloud, Layers, Cpu, Database, HardDrive, ShieldCheck, Terminal, Bot, Activity } from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                FirstPR Production AWS Architecture
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Engineered for WeMakeDevs × AWS Bharat Builds Tour (First Commit)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          
          {/* Architecture Pipeline Flow Diagram */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 font-mono">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-sans block">
              Event-Driven Pipeline Flow (AWS Step Functions)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold">1. Ingest</span>
                <p className="text-[11px] text-slate-400 font-sans">Amazon API Gateway & Lambda Ingestion</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-teal-500/40 space-y-1">
                <span className="text-teal-400 font-bold">2. Parallel Analysis</span>
                <p className="text-[11px] text-slate-400 font-sans">Step Functions parallel AST & Issue mapping</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-1">
                <span className="text-emerald-400 font-bold">3. Sandbox Runner</span>
                <p className="text-[11px] text-slate-400 font-sans">AWS ECS + Fargate isolated verification</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/40 space-y-1">
                <span className="text-purple-400 font-bold">4. Grounded AI</span>
                <p className="text-[11px] text-slate-400 font-sans">Amazon Bedrock (Claude 3.5) Walkthroughs</p>
              </div>
            </div>
          </div>

          {/* AWS Services Mapping Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                <Cloud className="w-4 h-4" />
                <span>AWS Amplify Hosting</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Hosts the React 19 SPA with global CloudFront CDN edge distribution and automated SSL.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
                <Layers className="w-4 h-4" />
                <span>AWS Step Functions</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Coordinates the asynchronous multi-stage analysis pipeline with native retry semantics and error handling.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <Cpu className="w-4 h-4" />
                <span>Amazon ECS + AWS Fargate</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Executes untrusted repository setup, builds, and tests inside ephemeral microVM containers with zero AWS credential exposure.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
                <Bot className="w-4 h-4" />
                <span>Amazon Bedrock (Claude 3.5 Sonnet)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Synthesizes beginner explanations from pre-computed evidence; strictly constrained by tree grounding rules.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                <Database className="w-4 h-4" />
                <span>Amazon DynamoDB</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Stores structured analysis reports, 7-signal scores, and cached evaluations with automated TTL expiration.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
                <HardDrive className="w-4 h-4" />
                <span>Amazon S3</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Persists container execution stdout/stderr logs, build artifacts, and repository AST graphs.
              </p>
            </div>

          </div>

          {/* Security & Cost Summary */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cost per repository analysis: <strong className="text-emerald-400 font-mono">~$0.0028 USD</strong></span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              CloudWatch Logs & Metrics Active
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
