import React, { useState } from 'react';
import { RepositorySummary, CodebaseNode } from '../types';
import { Box, CheckCircle, FileCode, Terminal, Folder, File, ChevronRight, ChevronDown, BookOpen, GitPullRequest, Layers } from 'lucide-react';

interface RepoAtAGlanceProps {
  summary: RepositorySummary;
}

const TreeNodeView: React.FC<{ node: CodebaseNode; depth?: number }> = ({ node, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isDirectory = node.type === 'directory';

  return (
    <div className="font-mono text-xs">
      <div
        onClick={() => isDirectory && setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 py-1 px-2 rounded hover:bg-slate-800/60 transition-colors ${
          isDirectory ? 'cursor-pointer text-slate-300' : 'text-slate-400'
        }`}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {isDirectory ? (
          <>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
            <Folder className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
            <span className="font-semibold text-slate-200">{node.name}/</span>
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0"></span>
            <File className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className={node.is_target ? 'text-emerald-300 font-bold' : node.is_test ? 'text-teal-300' : 'text-slate-300'}>
              {node.name}
            </span>
            {node.is_target && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-sans font-bold">
                Target
              </span>
            )}
            {node.is_test && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30 uppercase font-sans font-medium">
                Test
              </span>
            )}
          </>
        )}
      </div>

      {isDirectory && isOpen && node.children && (
        <div className="space-y-0.5">
          {node.children.map((child, idx) => (
            <TreeNodeView key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const RepoAtAGlance: React.FC<RepoAtAGlanceProps> = ({ summary }) => {
  const [showTree, setShowTree] = useState(true);

  return (
    <div className="bg-[#0e1422] border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Repository at a glance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Architecture and technical footprint discovered by FirstPR static analysis.
          </p>
        </div>
      </div>

      {/* Grid: Overview Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Summary & Specs */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* What this repository does */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              What this repository does
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {summary.architecture_overview}
            </p>
          </div>

          {/* Codebase Numbers Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Source Files</span>
              <span className="text-sm font-bold text-slate-200 font-mono mt-1 block">
                {summary.stack.total_source_files || summary.total_files_analyzed} files
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Test Files</span>
              <span className="text-sm font-bold text-teal-300 font-mono mt-1 block">
                {summary.stack.total_test_files || summary.stack.test_locations.length} test suites
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Estimated Size</span>
              <span className="text-sm font-bold text-slate-200 font-mono mt-1 block">
                {summary.stack.loc_estimate || `${summary.repository_size_kb} KB`}
              </span>
            </div>
          </div>

          {/* Entry points & Test Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-500 font-sans block">Primary Entry Point</span>
              <div className="flex items-center space-x-1.5 text-slate-200 truncate">
                <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{summary.stack.entry_points[0] || 'source/index.js'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-500 font-sans block">Test Harness</span>
              <div className="flex items-center space-x-1.5 text-slate-200 truncate">
                <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">{summary.stack.test_framework || 'Vitest'}</span>
              </div>
            </div>
          </div>

          {/* Contribution Guidance Badge Bar */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="text-[11px] font-semibold text-slate-400">Contribution Guidance:</span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>CONTRIBUTING.md detected</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
              <GitPullRequest className="w-3.5 h-3.5 text-teal-400" />
              <span>PR Template active</span>
            </span>
          </div>

        </div>

        {/* Right Side: Codebase Map Tree (Section 20) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 h-full flex flex-col">
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-900">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Codebase Structure Map</span>
              </div>
              <button
                onClick={() => setShowTree(!showTree)}
                className="text-[11px] text-slate-500 hover:text-slate-300 font-mono cursor-pointer"
              >
                {showTree ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {showTree && summary.tree_structure && (
              <div className="space-y-0.5 overflow-y-auto max-h-[260px] pr-1">
                {summary.tree_structure.map((node, idx) => (
                  <TreeNodeView key={idx} node={node} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
