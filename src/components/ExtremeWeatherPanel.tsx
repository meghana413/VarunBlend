import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  Gauge, 
  Users, 
  Tractor, 
  Building2,
  FileCheck
} from 'lucide-react';
import { ExtremeWeatherSignal, Subdivision } from '../types/weather';

interface ExtremeWeatherPanelProps {
  alert: ExtremeWeatherSignal;
  subdivision: Subdivision;
}

export const ExtremeWeatherPanel: React.FC<ExtremeWeatherPanelProps> = ({
  alert,
  subdivision
}) => {
  const [activeTab, setActiveTab] = useState<'public' | 'agriculture' | 'disaster'>('public');

  const getAlertStyles = (level: ExtremeWeatherSignal['level']) => {
    switch (level) {
      case 'red':
        return {
          bg: 'bg-red-950/40 border-red-500/60 ring-red-500/20',
          badge: 'bg-red-500 text-white shadow-red-500/30',
          icon: ShieldAlert,
          iconColor: 'text-red-400',
          glow: 'from-red-500/20 to-orange-500/10'
        };
      case 'orange':
        return {
          bg: 'bg-orange-950/40 border-orange-500/60 ring-orange-500/20',
          badge: 'bg-orange-500 text-white shadow-orange-500/30',
          icon: AlertTriangle,
          iconColor: 'text-orange-400',
          glow: 'from-orange-500/20 to-amber-500/10'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-950/30 border-yellow-500/50 ring-yellow-500/20',
          badge: 'bg-yellow-500 text-slate-950 shadow-yellow-500/20',
          icon: Info,
          iconColor: 'text-yellow-400',
          glow: 'from-yellow-500/15 to-lime-500/10'
        };
      default:
        return {
          bg: 'bg-emerald-950/30 border-emerald-500/50 ring-emerald-500/20',
          badge: 'bg-emerald-500 text-white shadow-emerald-500/20',
          icon: ShieldCheck,
          iconColor: 'text-emerald-400',
          glow: 'from-emerald-500/15 to-teal-500/10'
        };
    }
  };

  const styles = getAlertStyles(alert.level);
  const AlertIcon = styles.icon;

  return (
    <div id="extreme-weather-signals-section" className="space-y-4">
      
      {/* Top Main Alert Banner */}
      <div className={`p-5 rounded-2xl border ${styles.bg} ring-1 relative overflow-hidden backdrop-blur-md`}>
        <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gradient-to-br ${styles.glow} blur-3xl pointer-events-none`} />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
          
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 ${styles.iconColor} shrink-0`}>
              <AlertIcon className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${styles.badge}`}>
                  {alert.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  IMD Standard Color Code Protocol
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                {alert.headline}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {alert.synopticDiagnosis}
              </p>
            </div>
          </div>

          {/* Region Vulnerabilities Chip */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shrink-0 text-xs font-mono space-y-1 text-slate-300 min-w-48">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Subdivision Terrain Profile</div>
            <div className="text-white font-bold">{subdivision.name}</div>
            <div className="text-cyan-400 capitalize">{subdivision.terrain} Terrain</div>
            <div className="text-[11px] text-slate-400">Historical Risk: {subdivision.vulnerabilities[0]}</div>
          </div>

        </div>

      </div>

      {/* Grid: Probability of Exceedance Gauges + Sectoral Actionable Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Probability of Exceedance Gauges (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Probability of Exceedance (PoE)</h4>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Ensemble PDF</span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Derived from hybrid ensemble variance (σ_blend) across multi-model forecast distributions:
          </p>

          <div className="space-y-3">
            {alert.exceedanceProbabilities.map((item, idx) => {
              const prob = item.probability;
              const isHigh = prob >= 50;

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.threshold}</span>
                    <span className={`font-mono font-bold ${
                      prob >= 60 ? 'text-red-400' : (prob >= 35 ? 'text-amber-400' : 'text-slate-400')
                    }`}>
                      {prob}%
                    </span>
                  </div>

                  {/* Meter bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        prob >= 60
                          ? 'bg-gradient-to-r from-orange-500 to-red-500'
                          : (prob >= 35 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-cyan-500/70')
                      }`}
                      style={{ width: `${prob}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Sectoral Actionable Advisories (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Targeted Operational Advisories</h4>
              </div>
              
              {/* Sector selector pills */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('public')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
                    activeTab === 'public'
                      ? 'bg-cyan-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>Public</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('agriculture')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
                    activeTab === 'agriculture'
                      ? 'bg-cyan-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tractor className="w-3 h-3" />
                  <span>Agriculture</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('disaster')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
                    activeTab === 'disaster'
                      ? 'bg-cyan-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>Disaster Agencies</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-24 p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 text-xs leading-relaxed text-slate-200">
              {activeTab === 'public' && (
                <div className="space-y-2">
                  <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> General Public & Urban Commuter Protocol:
                  </div>
                  <p>{alert.actionAdvisory.public}</p>
                </div>
              )}

              {activeTab === 'agriculture' && (
                <div className="space-y-2">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Tractor className="w-3.5 h-3.5" /> Agro-Meteorological (Kisan) Guidance:
                  </div>
                  <p>{alert.actionAdvisory.agriculture}</p>
                </div>
              )}

              {activeTab === 'disaster' && (
                <div className="space-y-2">
                  <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> NDRF / SDRF / District Administration Protocol:
                  </div>
                  <p>{alert.actionAdvisory.disasterAgency}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Dispatched via IMD Common Alerting Protocol (CAP)</span>
            <span className="font-mono text-emerald-400">Automated Alert Synthesizer Active</span>
          </div>
        </div>

      </div>

    </div>
  );
};
