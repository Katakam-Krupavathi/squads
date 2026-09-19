import React from 'react';
import { SearchX, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

export const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-white">No strong first-contribution candidates found</h3>
      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
        We analyzed the repository, but none of the currently open issues appear suitable for a first contribution.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Try Another Repository</span>
      </button>
    </div>
  );
};

export const ErrorState: React.FC<{ error: string; onReset: () => void; onRetry?: () => void }> = ({
  error,
  onReset,
  onRetry
}) => {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-white">Repository Analysis Interrupted</h3>
      <p className="text-xs text-rose-300 font-mono max-w-md mx-auto leading-relaxed bg-rose-950/20 p-3 rounded-xl border border-rose-500/30">
        {error}
      </p>
      <div className="flex items-center justify-center space-x-3 pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Choose Demo Repo</span>
        </button>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Analysis</span>
          </button>
        )}
      </div>
    </div>
  );
};
