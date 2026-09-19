import React from 'react';
import { DifficultySignal } from '../types';
import { ShieldAlert, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

interface SignalRadarProps {
  signals: Record<string, DifficultySignal>;
}

export const SignalRadar: React.FC<SignalRadarProps> = ({ signals }) => {
  const signalList = Object.values(signals);

  const getSignalColor = (score: number) => {
    if (score <= 35) return 'bg-emerald-500 text-emerald-400 border-emerald-500/30';
    if (score <= 65) return 'bg-amber-500 text-amber-400 border-amber-500/30';
    return 'bg-rose-500 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>7-Signal Difficulty Evidence Breakdown</span>
        </span>
        <span className="text-[10px] font-mono text-slate-500">
          Transparent Weighted Formula (Sum = 1.0)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {signalList.map((sig, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            {/* Signal Title & Score */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">{sig.name}</span>
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-[10px] text-slate-500">wt: {(sig.weight * 100).toFixed(0)}%</span>
                <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                  sig.score <= 35 ? 'text-emerald-400 bg-emerald-500/10' :
                  sig.score <= 65 ? 'text-amber-400 bg-amber-500/10' :
                  'text-rose-400 bg-rose-500/10'
                }`}>
                  {sig.score}/100
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-1.5 my-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  sig.score <= 35 ? 'bg-emerald-500' :
                  sig.score <= 65 ? 'bg-amber-500' :
                  'bg-rose-500'
                }`}
                style={{ width: `${Math.max(8, sig.score)}%` }}
              ></div>
            </div>

            {/* Explanation & Evidence */}
            <p className="text-[11px] text-slate-400 leading-snug">
              {sig.explanation}
            </p>

            {sig.evidence.length > 0 && (
              <div className="mt-2 space-y-1">
                {sig.evidence.slice(0, 2).map((ev, evIdx) => (
                  <div key={evIdx} className="flex items-start space-x-1.5 text-[10px] text-slate-500 font-mono">
                    <span className="text-slate-600 mt-0.5">•</span>
                    <span className="text-slate-400 leading-tight">{ev}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
