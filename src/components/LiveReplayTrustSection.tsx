import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  AlertTriangle, 
  Activity, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  BellRing,
  Info,
  ChevronRight,
  Radio
} from 'lucide-react';
import { 
  REPLAY_CASE_STUDY, 
  ALPHA_DECAY,
  computeDivergenceIndex,
  updateTrustScores,
  generatePlainLanguageAdvisory
} from '../utils/replayEngine';
import { FORECAST_MODELS } from '../data/models';
import { ModelId } from '../types/weather';

export const LiveReplayTrustSection: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1); // Default to Day 2 where Divergence Spikes!
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(3000); // 3 seconds per day

  const step = REPLAY_CASE_STUDY[currentStepIndex];

  // Auto-play interval
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= REPLAY_CASE_STUDY.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const prevStep = currentStepIndex > 0 ? REPLAY_CASE_STUDY[currentStepIndex - 1] : step;

  // Compute live trust score object
  const liveTrustScores = updateTrustScores(
    prevStep.trustScores,
    step.modelForecasts,
    step.observedRainfall
  );

  // Divergence info
  const divergenceInfo = computeDivergenceIndex(step.modelForecasts, 2);

  return (
    <div id="live-replay-trust-section" className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 lg:p-7 space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-cyan-500/20">
      
      {/* Background Subtle Accent Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header with Live Simulation Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[11px] font-bold animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE HISTORICAL REPLAY ENGINE</span>
            </div>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-cyan-400 font-mono font-semibold">
              Case Study: Konkan-Goa Severe Monsoon Inundation
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 tracking-tight">
            Self-Correcting Trust Scores & Divergence Early Warning
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating near-real-time model divergence detection and live EMA trust score re-weighting
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Live Replay</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            title="Reset to Day 1"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentStepIndex < REPLAY_CASE_STUDY.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
              }
            }}
            title="Step Next Day"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-800 text-[10px] font-mono text-slate-400">
            {[3000, 1500].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded ${playbackSpeed === speed ? 'bg-slate-800 text-cyan-400 font-bold' : 'hover:text-slate-200'}`}
              >
                {speed === 3000 ? '1x' : '2x'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Timeline Day Stepper */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Replay Timeline:</span>
          <span className="text-cyan-300 font-bold">{step.dateStr}</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {REPLAY_CASE_STUDY.map((item, idx) => {
            const isActive = idx === currentStepIndex;
            const isSpike = item.divergenceIndex >= 0.70;
            const isPeak = idx === 3; // Day 4 Peak Deluge

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className={`p-2 rounded-xl text-left transition-all border ${
                  isActive
                    ? 'bg-cyan-950/80 border-cyan-500 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'bg-slate-850/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={`font-bold ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                    Day {item.dayNumber}
                  </span>
                  {isSpike && (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" title="Divergence Spike" />
                  )}
                  {isPeak && (
                    <span className="w-2 h-2 rounded-full bg-purple-400" title="Peak Deluge" />
                  )}
                </div>
                <div className="text-xs font-bold text-white font-mono truncate">
                  {item.observedRainfall}mm
                </div>
                <div className="text-[9px] text-slate-400 font-mono truncate">
                  Div: {item.divergenceIndex}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-2.5 rounded-lg bg-slate-850/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Synoptic Weather Situation:</strong> {step.synopticSituation}
          </div>
        </div>
      </div>

      {/* FEATURE 1 & FEATURE 3: DIVERGENCE INDEX GAUGE & ACTIONABLE ADVISORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        
        {/* Divergence Index Early Warning Card (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  1. Model Disagreement Divergence Index
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                divergenceInfo.level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                divergenceInfo.level === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {divergenceInfo.level} SPREAD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Normalized variance between physical NWP and AI weather models.
            </p>
          </div>

          {/* Divergence Score Dial */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Divergence Index (0.0 - 1.0)</div>
              <div className="text-3xl font-extrabold font-mono text-white flex items-baseline gap-2 mt-0.5">
                <span className={step.divergenceIndex >= 0.70 ? 'text-red-400' : (step.divergenceIndex >= 0.50 ? 'text-amber-400' : 'text-cyan-400')}>
                  {step.divergenceIndex}
                </span>
                <span className="text-xs text-slate-500 font-normal">/ 1.00</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Std Dev (σ): <strong className="text-white">{divergenceInfo.spreadStd} mm</strong>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="w-32 space-y-1.5">
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    step.divergenceIndex >= 0.70
                      ? 'bg-gradient-to-r from-amber-500 to-red-500 shadow-md shadow-red-500/50'
                      : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                  }`}
                  style={{ width: `${Math.round(step.divergenceIndex * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>0.0 (Consensus)</span>
                <span>1.0 (Chaos)</span>
              </div>
            </div>
          </div>

          {/* EARLY WARNING TRIGGER ALERT */}
          {step.earlyWarningFired ? (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs space-y-1.5 animate-pulse shadow-lg shadow-red-900/30">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <BellRing className="w-4 h-4 text-red-400 animate-bounce" />
                <span>EARLY-WARNING SIGNAL FIRED (48h Lead Time)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-200">
                A sudden spike in model divergence ($D = {step.divergenceIndex}$) indicates an atmospheric bifurcation! AI models (GraphCast & Pangu) detected rapid convective intensification while physical NWP models lagged behind. Extreme weather risk surfaced <strong>before any single model issued an alert</strong>!
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-slate-300">Divergence Diagnostics:</strong> Physical NWP mean is {divergenceInfo.divergenceDrivers.nwpMean}mm vs AI Data-Driven mean of {divergenceInfo.divergenceDrivers.aiMean}mm (Gap: {divergenceInfo.divergenceDrivers.spreadGap}mm).
            </div>
          )}

        </div>

        {/* Feature 3: Actionable Plain-Language Advisory Card (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  3. Plain-Language Actionable Advisory Engine
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-850 px-2 py-0.5 rounded border border-slate-700">
                Rule-Based Synthesis
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Converts (Blended Forecast + Model Confidence + Divergence Index) into an immediate directive.
            </p>
          </div>

          {/* The Single Crisp Advisory Sentence */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-750 shadow-md space-y-2">
            <div className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider font-semibold">
              Live Synthesized Directive:
            </div>
            <div className="text-sm sm:text-base font-semibold text-white leading-snug">
              "{step.advisory}"
            </div>
          </div>

          {/* Quantitative Context Chips */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Blended Consensus</div>
              <div className="text-base font-bold text-cyan-400 font-mono">{step.blendedForecast} mm</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Ground Truth Obs</div>
              <div className="text-base font-bold text-emerald-400 font-mono">{step.observedRainfall} mm</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Blend Accuracy</div>
              <div className="text-base font-bold text-purple-400 font-mono">
                {Math.abs(step.blendedForecast - step.observedRainfall).toFixed(1)} mm Err
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* FEATURE 2: SELF-CORRECTING LIVE TRUST SCORE TICKER */}
      <div className="space-y-3 relative z-10 pt-2 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-bold text-white">
                2. Self-Correcting Live Trust Score Ticker (EMA Updating)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              As ground truth is observed, each model's error is evaluated and rolling trust score updates in real-time (α = 0.25, 4-cycle memory).
            </p>
          </div>

          <div className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            Decay Factor α = 0.25 | Formula: T_t = α · Skill + (1 - α) · T_(t-1)
          </div>
        </div>

        {/* 6-Model Trust Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FORECAST_MODELS.map((model) => {
            const trust = liveTrustScores[model.id];
            const rawForecast = step.modelForecasts[model.id];
            const isUp = trust.trend === 'up';
            const isDown = trust.trend === 'down';

            return (
              <div
                key={model.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white truncate" style={{ color: model.color }}>
                      {model.name.split(' ')[0]}
                    </span>
                    <div className="flex items-center gap-0.5 text-[10px] font-mono">
                      {isUp && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                      {isDown && <TrendingDown className="w-3 h-3 text-red-400" />}
                      <span className={isUp ? 'text-emerald-400' : (isDown ? 'text-red-400' : 'text-slate-400')}>
                        {trust.score}%
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    Pred: <strong className="text-slate-200">{rawForecast}mm</strong>
                  </div>
                </div>

                {/* Progress bar of Trust */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${trust.score}%`,
                        backgroundColor: model.color
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span>Err: {trust.recentError}mm</span>
                    <span className="text-slate-300 font-semibold">Wt: {trust.weightInBlend}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explain how trust score feeds back into blending weights */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            <strong className="text-white">Closed-Loop Self Correction:</strong> Notice on Day 4: GFS overpredicted by 51mm, so its trust plunged to 58%, automatically shedding blending weight. NCUM and ECMWF had under 6mm error, so their trust and weights surged. The system learned and corrected itself live.
          </span>
        </div>

      </div>

    </div>
  );
};
