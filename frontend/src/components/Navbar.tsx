import React from 'react';
import { GitPullRequest, Cloud, Sparkles, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onOpenArchitecture: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenArchitecture, onReset }) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0e1420]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={onReset}
          className="flex items-center space-x-3 text-left group transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-950/40">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GitPullRequest className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                FirstPR
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Verified Open-Source Contributions
            </p>
          </div>
        </button>

        {/* Hackathon Badge & Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-medium text-slate-400">WeMakeDevs × AWS</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-300 font-semibold">Bharat Builds Tour</span>
          </div>

          <button
            onClick={onOpenArchitecture}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm"
          >
            <Cloud className="w-4 h-4 text-amber-400" />
            <span>AWS Architecture</span>
          </button>
        </div>

      </div>
    </header>
  );
};
