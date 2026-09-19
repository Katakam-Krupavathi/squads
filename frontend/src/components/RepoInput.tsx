import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Github, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { RepositoryAnalysis } from '../types';

interface RepoInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  demoRepos: RepositoryAnalysis[];
}

export const RepoInput: React.FC<RepoInputProps> = ({ onAnalyze, isLoading, demoRepos }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    if (!url.includes('github.com')) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/chalk/chalk)');
      return;
    }
    setError(null);
    onAnalyze(url.trim());
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-16 px-4">
      
      {/* Hero Pitch */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Stop Getting Stuck On Your First Open-Source Contribution</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Turn Any Repo Into A <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Verified First Contribution
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          FirstPR calculates measurable difficulty evidence, catches mislabelled "good first issues", proves the local build works in an isolated sandbox, and guides your fix in real code.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Github className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste a public GitHub repository URL (e.g. https://github.com/chalk/chalk)"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-950/50 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            <span>{isLoading ? 'Analyzing...' : 'Analyze Repository'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {error && (
          <p className="mt-3 text-xs text-rose-400 font-medium pl-2">
            {error}
          </p>
        )}

        {/* Demo Quick Select Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/70 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verified Demo Repos:
          </span>
          {demoRepos.map((demo) => (
            <button
              key={demo.id}
              type="button"
              onClick={() => {
                setUrl(demo.repository_url);
                onAnalyze(demo.repository_url);
              }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform"></span>
              <span>{demo.summary.full_name}</span>
              <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded">
                {demo.summary.stack.primary_language}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">Real Environment Sandbox</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Executes actual install, build, and test steps on AWS ECS Fargate.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">Expose Mislabelled Issues</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">7-signal difficulty engine challenges misleading beginner labels.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">Grounded Walkthroughs</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Step-by-step reading order strictly validated against the real repo tree.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
