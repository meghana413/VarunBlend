import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  HelpCircle,
  Activity
} from 'lucide-react';
import { Subdivision, ModelContribution, ForecastVariable } from '../types/weather';
import { SUBDIVISIONS } from '../data/subdivisions';
import { FORECAST_MODELS } from '../data/models';

interface ModelWeightVisualizerProps {
  selectedSubdivision: Subdivision;
  onSelectSubdivision: (sub: Subdivision) => void;
  models: ModelContribution[];
  leadDay: number;
  variable: ForecastVariable;
}

export const ModelWeightVisualizer: React.FC<ModelWeightVisualizerProps> = ({
  selectedSubdivision,
  onSelectSubdivision,
  models,
  leadDay,
  variable
}) => {
  const [hoveredSub, setHoveredSub] = useState<Subdivision | null>(null);
  const [mapColorMode, setMapColorMode] = useState<'dominant_model' | 'zone'>('dominant_model');

  // Compute dominant model for each subdivision to render map
  const getSubdivisionDominantModel = (sub: Subdivision) => {
    if (sub.terrain === 'ghats' || sub.terrain === 'himalayan') {
      return leadDay <= 3 ? 'ncum' : 'ecmwf';
    }
    if (sub.terrain === 'arid') {
      return 'pangu';
    }
    if (sub.terrain === 'coastal' || sub.terrain === 'island') {
      return leadDay <= 3 ? 'graphcast' : 'ecmwf';
    }
    return leadDay <= 2 ? 'graphcast' : 'ecmwf';
  };

  const getModelColor = (modelId: string) => {
    switch (modelId) {
      case 'ecmwf': return '#3b82f6';
      case 'gfs': return '#06b6d4';
      case 'ncum': return '#10b981';
      case 'graphcast': return '#8b5cf6';
      case 'pangu': return '#f59e0b';
      case 'fourcastnet': return '#ec4899';
      default: return '#64748b';
    }
  };

  // Lead-time weight evolution across Day 1 to Day 7 for current subdivision
  const leadTimeEvolution = [
    { day: 1, aiWeight: 58, nwpWeight: 42, topModel: 'GraphCast / Pangu' },
    { day: 2, aiWeight: 54, nwpWeight: 46, topModel: 'GraphCast / NCUM' },
    { day: 3, aiWeight: 49, nwpWeight: 51, topModel: 'ECMWF / NCUM' },
    { day: 4, aiWeight: 42, nwpWeight: 58, topModel: 'ECMWF IFS' },
    { day: 5, aiWeight: 36, nwpWeight: 64, topModel: 'ECMWF IFS' },
    { day: 6, aiWeight: 31, nwpWeight: 69, topModel: 'ECMWF / GFS' },
    { day: 7, aiWeight: 26, nwpWeight: 74, topModel: 'ECMWF IFS' },
  ];

  return (
    <div id="model-weight-maps-section" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* Left: Interactive Regional Map of Indian Subdivisions (7 Cols) */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Regional Model Reliability Map (36 Subdivisions)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Spatial map showing which forecasting system provides superior skill for Day {leadDay}
              </p>
            </div>

            {/* Toggle Map Color Mode */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setMapColorMode('dominant_model')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  mapColorMode === 'dominant_model'
                    ? 'bg-cyan-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dominant Model
              </button>
              <button
                type="button"
                onClick={() => setMapColorMode('zone')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  mapColorMode === 'zone'
                    ? 'bg-cyan-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Climate Zone
              </button>
            </div>
          </div>

          {/* Model Color Legend */}
          <div className="flex flex-wrap items-center gap-3 py-2 px-3 rounded-xl bg-slate-850 border border-slate-800 mb-3 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Top Ranked:
            </span>
            {FORECAST_MODELS.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="text-slate-300">{m.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* Interactive Geographic Map Canvas representation */}
          <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-2">
            
            {/* SVG India Map Grid with Subdivisions */}
            <svg
              viewBox="67 6 32 32"
              className="w-full h-full max-h-96"
              style={{ filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.15))' }}
            >
              {/* Background ambient grid lines */}
              <defs>
                <pattern id="subgrid" width="2" height="2" patternUnits="userSpaceOnUse">
                  <path d="M 2 0 L 0 0 0 2" fill="none" stroke="#1e293b" strokeWidth="0.05" />
                </pattern>
              </defs>
              <rect x="67" y="6" width="32" height="32" fill="url(#subgrid)" />

              {/* Subdivisions as responsive interactive nodes & regions */}
              {SUBDIVISIONS.map((sub) => {
                const isSelected = selectedSubdivision.id === sub.id;
                const domModel = getSubdivisionDominantModel(sub);
                const color = mapColorMode === 'dominant_model' ? getModelColor(domModel) : (
                  sub.zone === 'Northwest' ? '#38bdf8' :
                  sub.zone === 'Central' ? '#34d399' :
                  sub.zone === 'East & Northeast' ? '#a78bfa' :
                  sub.zone === 'South Peninsular' ? '#f59e0b' : '#ec4899'
                );

                // Invert latitude for SVG y coordinate: India spans approx Lat 8 to 36 (Y 38 to 8), Lon 68 to 97 (X 68 to 97)
                const cx = sub.centerLon;
                const cy = 42 - sub.centerLat;

                return (
                  <g
                    key={sub.id}
                    id={`map-node-${sub.id}`}
                    className="cursor-pointer transition-all duration-300 group"
                    onClick={() => onSelectSubdivision(sub)}
                    onMouseEnter={() => setHoveredSub(sub)}
                    onMouseLeave={() => setHoveredSub(null)}
                  >
                    {/* Pulsing ring for selected subdivision */}
                    {isSelected && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="2.2"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="0.25"
                        className="animate-ping origin-center opacity-75"
                      />
                    )}

                    {/* Regional halo circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? "1.6" : "1.1"}
                      fill={color}
                      fillOpacity={isSelected ? "0.85" : "0.55"}
                      stroke={isSelected ? "#ffffff" : color}
                      strokeWidth={isSelected ? "0.3" : "0.12"}
                      className="transition-all hover:scale-125"
                    />

                    {/* Short Code Label */}
                    <text
                      x={cx}
                      y={cy + 0.35}
                      fontSize="0.8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#ffffff"
                      pointerEvents="none"
                    >
                      {sub.code}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {(hoveredSub || selectedSubdivision) && (
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-slate-900/95 border border-cyan-500/40 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs font-mono ring-1 ring-white/10">
                <div className="flex items-center justify-between font-bold text-white mb-1">
                  <span>{(hoveredSub || selectedSubdivision).name}</span>
                  <span className="text-cyan-400">{(hoveredSub || selectedSubdivision).code}</span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-0.5">
                  <div>Zone: {(hoveredSub || selectedSubdivision).zone} • Terrain: {(hoveredSub || selectedSubdivision).terrain}</div>
                  <div>Primary Risk: {(hoveredSub || selectedSubdivision).vulnerabilities[0]}</div>
                  <div className="text-cyan-400 font-semibold pt-1 border-t border-slate-800">
                    Lead Day {leadDay} Top Model: {getSubdivisionDominantModel(hoveredSub || selectedSubdivision).toUpperCase()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <span>Currently Inspecting: <strong className="text-white">{selectedSubdivision.name}</strong></span>
          <span className="text-[11px] font-mono text-cyan-400">Normal Rain: {selectedSubdivision.normalMonsoonRainfallMm} mm</span>
        </div>
      </div>

      {/* Right: Dynamic Weight Allocation & Lead-Time Decay Curves (5 Cols) */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Dynamic Weights for Selected Region */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Adaptive Weight Allocation</span>
              </h3>
              <p className="text-xs text-slate-400">
                Conditioned on past skill in {selectedSubdivision.name}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Day {leadDay}
            </span>
          </div>

          {/* Model Weights List */}
          <div className="space-y-2.5">
            {models.map((m) => {
              const pct = Math.round(m.dynamicWeight * 100);
              return (
                <div key={m.modelId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="font-semibold text-slate-200">{m.modelName}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">
                        {m.type === 'AI_DATA_DRIVEN' ? 'AI' : 'NWP'}
                      </span>
                    </div>
                    <div className="font-mono font-bold text-white">
                      {pct}%
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${pct}%`,
                        backgroundColor: m.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead-Time Horizon Transition (Day 1 to Day 7) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>AI vs NWP Lead-Time Shift</span>
              </h3>
              <p className="text-xs text-slate-400">
                How reliability dynamically transfers as forecast horizon extends
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Days 1 - 7</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {leadTimeEvolution.map((item) => {
              const isCurrentDay = item.day === leadDay;
              return (
                <div
                  key={item.day}
                  className={`p-2 rounded-xl transition-all flex items-center justify-between ${
                    isCurrentDay
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white w-12">Day {item.day}</span>
                    <div className="w-24 sm:w-32 bg-slate-800 rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-purple-500 h-full"
                        style={{ width: `${item.aiWeight}%` }}
                        title={`AI Models: ${item.aiWeight}%`}
                      />
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${item.nwpWeight}%` }}
                        title={`Physical NWP: ${item.nwpWeight}%`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-purple-400">{item.aiWeight}% AI</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-blue-400">{item.nwpWeight}% NWP</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-cyan-400 font-semibold">Key Meteorological Takeaway:</span> AI models (GraphCast, Pangu) achieve highest precision in short horizons (D1-D3), while physical NWP dynamical equations (ECMWF, NCUM) stabilize errors at extended ranges (D5-D7).
          </div>
        </div>

      </div>

    </div>
  );
};
