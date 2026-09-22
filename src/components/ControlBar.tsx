import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  CloudRain, 
  Cpu, 
  Clock, 
  ChevronDown, 
  Search, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { 
  Subdivision, 
  Season, 
  WeatherRegime, 
  BlendingAlgorithm, 
  RegionZone 
} from '../types/weather';
import { SUBDIVISIONS } from '../data/subdivisions';

interface ControlBarProps {
  selectedSubdivision: Subdivision;
  onSelectSubdivision: (sub: Subdivision) => void;
  season: Season;
  onChangeSeason: (season: Season) => void;
  regime: WeatherRegime;
  onChangeRegime: (regime: WeatherRegime) => void;
  algorithm: BlendingAlgorithm;
  onChangeAlgorithm: (algo: BlendingAlgorithm) => void;
  leadDay: number;
  onChangeLeadDay: (day: number) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  selectedSubdivision,
  onSelectSubdivision,
  season,
  onChangeSeason,
  regime,
  onChangeRegime,
  algorithm,
  onChangeAlgorithm,
  leadDay,
  onChangeLeadDay
}) => {
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [subSearch, setSubSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState<RegionZone | 'ALL'>('ALL');

  const filteredSubdivisions = SUBDIVISIONS.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(subSearch.toLowerCase()) || 
                          sub.states.some(st => st.toLowerCase().includes(subSearch.toLowerCase())) ||
                          sub.code.toLowerCase().includes(subSearch.toLowerCase());
    const matchesZone = zoneFilter === 'ALL' || sub.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const zones: (RegionZone | 'ALL')[] = ['ALL', 'Northwest', 'Central', 'East & Northeast', 'South Peninsular', 'Islands'];

  return (
    <div id="control-bar" className="bg-slate-900 border-b border-slate-800 p-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Top row: Subdivision dropdown + Key Weather Scenario Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Indian Subdivision Selector */}
          <div className="relative">
            <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Subdivision / Region</span>
            </label>
            <button
              id="btn-subdivision-dropdown"
              type="button"
              onClick={() => setIsSubOpen(!isSubOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-left text-sm font-medium text-slate-100 transition-colors focus:ring-2 focus:ring-cyan-500/30"
            >
              <div className="truncate pr-2">
                <span className="text-white font-semibold">{selectedSubdivision.name}</span>
                <span className="text-xs text-slate-400 block truncate">
                  {selectedSubdivision.zone} Zone • {selectedSubdivision.terrain.toUpperCase()}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSubOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isSubOpen && (
              <div 
                id="subdivision-dropdown-menu"
                className="absolute left-0 mt-2 w-80 sm:w-96 max-h-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col p-3 ring-1 ring-white/10"
              >
                {/* Search Bar */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by state or subdivision..."
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Zone Filter Chips */}
                <div className="flex flex-wrap gap-1 mb-2.5 pb-2 border-b border-slate-800">
                  {zones.map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setZoneFilter(z)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                        zoneFilter === z
                          ? 'bg-cyan-500 text-white font-semibold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {z}
                    </button>
                  ))}
                </div>

                {/* List of Subdivisions */}
                <div className="overflow-y-auto space-y-1 pr-1 flex-1">
                  {filteredSubdivisions.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        onSelectSubdivision(sub);
                        setIsSubOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedSubdivision.id === sub.id
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-100">{sub.name}</div>
                        <div className="text-[10px] text-slate-400">{sub.states.join(', ')}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {sub.code}
                      </span>
                    </button>
                  ))}
                  {filteredSubdivisions.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No subdivisions found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. Season Selector */}
          <div>
            <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Season</span>
            </label>
            <select
              id="select-season"
              value={season}
              onChange={(e) => onChangeSeason(e.target.value as Season)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="monsoon">Southwest Monsoon (Jun-Sep)</option>
              <option value="post_monsoon">Post-Monsoon / NE (Oct-Dec)</option>
              <option value="winter">Winter Season (Jan-Feb)</option>
              <option value="pre_monsoon">Pre-Monsoon / Summer (Mar-May)</option>
            </select>
          </div>

          {/* 3. Synoptic Weather Regime */}
          <div>
            <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Weather Regime</span>
            </label>
            <select
              id="select-regime"
              value={regime}
              onChange={(e) => onChangeRegime(e.target.value as WeatherRegime)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="monsoon_active">Active Monsoon (LLJ Surge / Heavy Trough)</option>
              <option value="monsoon_break">Monsoon Break (Foothill Trough Shift)</option>
              <option value="cyclone_depression">Tropical Cyclone / Deep Depression</option>
              <option value="western_disturbance">Western Disturbance (Westerly Trough)</option>
              <option value="normal_fair">Normal Synoptic / Fair Weather</option>
            </select>
          </div>

          {/* 4. Blending Algorithm */}
          <div>
            <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Blending Algorithm</span>
            </label>
            <select
              id="select-algorithm"
              value={algorithm}
              onChange={(e) => onChangeAlgorithm(e.target.value as BlendingAlgorithm)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="inverse_variance">Inverse Variance Weighting (IVW)</option>
              <option value="bayesian_bma">Bayesian Model Averaging (BMA)</option>
              <option value="ml_stacking">Machine Learning Ridge Stacking</option>
              <option value="equal_weight">Simple Ensemble Mean (Equal Weights)</option>
            </select>
          </div>

        </div>

        {/* Bottom row: Lead Time Timeline Scrubber (Day 1 to Day 7) */}
        <div className="pt-2 border-t border-slate-800/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Forecast Lead Time:
            </span>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Day {leadDay} (+{leadDay * 24}h Horizon)
            </span>
          </div>

          {/* Lead Day Quick Selectors */}
          <div className="flex items-center gap-1.5 bg-slate-800/70 p-1 rounded-xl border border-slate-700/60 self-start md:self-auto">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <button
                key={d}
                id={`btn-lead-day-${d}`}
                type="button"
                onClick={() => onChangeLeadDay(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  leadDay === d
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20 scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Day {d}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
