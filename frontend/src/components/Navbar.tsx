import React from 'react';
import { GitPullRequest, Cloud, HelpCircle, Github, Sparkles, RefreshCw } from 'lucide-react';
import { IS_DEMO_MODE } from '../services';

interface NavbarProps {
  onOpenArchitecture: () => void;
  onOpenHowItWorks: () => void;
  onReset: () => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenArchitecture,
  onOpenHowItWorks,
  onReset,
  currentView
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={onReset}
            className="flex items-center space-x-2.5 text-left group transition-all cursor-pointer"
            data-testid="brand-logo"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors shadow-sm">
              <span className="font-mono text-xs font-bold text-emerald-400 group-hover:scale-110 transition-transform">
                &lt;PR/&gt;
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  FirstPR
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700/60">
                  First Commit 2026
                </span>
              </div>
            </div>
          </button>

          {/* Demo Mode Badge */}
          {IS_DEMO_MODE && (
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Demo Mode</span>
            </div>
          )}
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          <button
            onClick={onOpenHowItWorks}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>How it works</span>
          </button>

          <button
            onClick={onOpenArchitecture}
            data-testid="architecture-button"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-amber-300 font-medium transition-all shadow-sm cursor-pointer"
          >
            <Cloud className="w-3.5 h-3.5 text-amber-400" />
            <span>AWS Architecture</span>
          </button>

          <a
            href="https://github.com/FirstPR/firstpr"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

      </div>
    </header>
  );
};
