import React from 'react';
import { X, ShieldAlert, Cpu, BookOpen, Compass, CheckCircle2, Sparkles } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0e1422] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                How FirstPR Works
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Solving the 3 major onboarding failures in open-source
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          
          {/* Pillar 1 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Failure 1 — The "Good First Issue" Label Lie</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              GitHub issues are often labelled <code>good first issue</code> by maintainers while secretly requiring changes across multiple central modules, deep framework internals, or unmocked hardware drivers.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <strong>FirstPR Solution: </strong> Calculates 7 transparent repository signals (Blast Radius, Centrality, Complexity, Test Proximity, Spec Quality, Social State, Domain Prerequisites) to expose mislabelled issues.
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Failure 2 — The Environment Wall</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              Contributors clone a repository and immediately fail due to runtime version mismatches, missing lockfiles, or broken build steps.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <strong>FirstPR Solution: </strong> Actually executes <code>install</code>, <code>build</code>, and <code>test</code> inside an isolated container on AWS ECS Fargate, verifying the test harness works before you write a single line.
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Failure 3 — The Orientation Gap</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              Even after setup, newcomers don't know which files to read first, which helper functions produce the behavior, or what conventions to follow.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <strong>FirstPR Solution: </strong> Generates a step-by-step reading order timeline strictly validated against the repository tree (Zero Hallucinated Paths).
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
