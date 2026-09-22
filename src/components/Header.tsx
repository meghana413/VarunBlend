import React from 'react';
import { CloudLightning, Play, FileText, Info, RefreshCw, Sun, Moon, Sparkles, Globe } from 'lucide-react';

interface HeaderProps {
  onOpenPipeline: () => void;
  onOpenGuide: () => void;
  onOpenBulletin: () => void;
  isPipelineRunning: boolean;
  cycleTime: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  dataSourceLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPipeline,
  onOpenGuide,
  onOpenBulletin,
  isPipelineRunning,
  cycleTime,
  isDarkMode,
  onToggleDarkMode,
  dataSourceLabel = 'Open-Meteo Multi-Model NWP'
}) => {
  return (
    <header id="app-header" className="border-b border-slate-800 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Branding & SIH Tag */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <CloudLightning className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                VARUN-Blend
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  SIH26081
                </span>
              </h1>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
                v2.5 Vercel-Serverless
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hybrid AI–NWP Multi-Model Adaptive Forecast Blending System
            </p>
          </div>
        </div>

        {/* Right: Operational Status & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Real Data Source Badge */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300"
            title="Real-world NWP & AI model data powered by Open-Meteo free API (ECMWF, GFS, ICON) with zero API keys required"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">{dataSourceLabel}</span>
            <span className="xl:hidden">Real NWP</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Active Cycle Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>CYCLE: {cycleTime}</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-medium">6 Models Ingested</span>
          </div>

          {/* AI Meteorological Bulletin Button */}
          <button
            id="btn-open-bulletin"
            onClick={onOpenBulletin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            title="Generate AI Operational Meteorological Synthesis Bulletin"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Bulletin</span>
          </button>

          {/* Guide for Hackathon */}
          <button
            id="btn-open-guide"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-colors hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            title="Judges Guide & Meteorological Formulation"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Pitch & Architecture</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-medium transition-colors hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle visual theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Routine Workflow Batch Runner */}
          <button
            id="btn-trigger-pipeline"
            onClick={onOpenPipeline}
            disabled={isPipelineRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isPipelineRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isPipelineRunning ? 'Running...' : 'Batch Workflow'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
