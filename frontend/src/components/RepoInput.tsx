import React, { useState } from 'react';
import { ArrowRight, Github, ShieldAlert, Cpu, CheckCircle2, Sparkles, Terminal } from 'lucide-react';
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
      setError('Please enter a GitHub repository URL.');
      return;
    }
    if (!url.toLowerCase().includes('github.com') && !url.startsWith('example/')) {
      setError('That doesn\'t look like a GitHub repository URL (e.g. https://github.com/chalk/chalk).');
      return;
    }
    setError(null);
    onAnalyze(url.trim());
  };

  const handleSelectDemo = (demoUrl: string) => {
    setUrl(demoUrl);
    setError(null);
    onAnalyze(demoUrl);
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-16 px-4">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Developer Intelligence for First-Time Contributors</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Your first open-source PR <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            shouldn't start with guesswork.
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Paste a public GitHub repository. FirstPR finds genuinely beginner-friendly issues, verifies the development environment, and maps the code you need to understand.
        </p>
      </div>

      {/* Main Input Form Card */}
      <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Github className="w-5 h-5" />
            </div>
            <input
              type="text"
              data-testid="repo-input"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="https://github.com/chalk/chalk"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-950/90 border border-slate-700/70 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            data-testid="analyze-button"
            disabled={isLoading}
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            <span>{isLoading ? 'Analyzing...' : 'Analyze Repository'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        {error && (
          <p className="mt-3 text-xs text-rose-400 font-medium pl-2">
            {error}
          </p>
        )}

        {/* Demo Repository Chips */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-400">
              Try a demo repository:
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Deterministic Precomputed Results
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {demoRepos.map((demo) => {
              const isBroken = demo.id.includes('broken');
              const isUnsupported = demo.id.includes('unsupported');
              return (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleSelectDemo(demo.repository_url)}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer group"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isBroken ? 'bg-amber-400' : isUnsupported ? 'bg-slate-500' : 'bg-emerald-400'
                  }`}></span>
                  <span className="font-mono text-[11px]">{demo.summary.full_name}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    {demo.summary.stack.primary_language}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trust & Differentiator Strip (Section 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        
        <div className="p-4 rounded-xl bg-[#0e1422]/60 border border-slate-800/70 space-y-1.5">
          <div className="flex items-center space-x-2 text-slate-200 text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Issues, interrogated</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            We don't trust the good-first-issue label blindly. 7 deterministic signals calculate real difficulty before you write code.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1422]/60 border border-slate-800/70 space-y-1.5">
          <div className="flex items-center space-x-2 text-slate-200 text-xs font-bold">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Setup, executed</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Commands are verified in an isolated environment on AWS ECS Fargate, proving tests pass before you touch the codebase.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1422]/60 border border-slate-800/70 space-y-1.5">
          <div className="flex items-center space-x-2 text-slate-200 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Guidance, grounded</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every suggested file in the reading order timeline is verified against the real repository tree — zero hallucinated paths.
          </p>
        </div>

      </div>

    </div>
  );
};
