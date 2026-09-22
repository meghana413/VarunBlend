import React from 'react';
import { 
  CloudRain, 
  ThermometerSun, 
  ThermometerSnowflake, 
  Wind, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { BlendedForecastOutput, ForecastVariable, ModelId } from '../types/weather';

interface BlendedForecastCardsProps {
  rainfall: BlendedForecastOutput;
  maxTemp: BlendedForecastOutput;
  minTemp: BlendedForecastOutput;
  windSpeed: BlendedForecastOutput;
  activeVariable: ForecastVariable;
  onSelectVariable: (v: ForecastVariable) => void;
}

export const BlendedForecastCards: React.FC<BlendedForecastCardsProps> = ({
  rainfall,
  maxTemp,
  minTemp,
  windSpeed,
  activeVariable,
  onSelectVariable
}) => {
  const cards = [
    {
      id: 'rainfall' as ForecastVariable,
      title: '24-Hour Rainfall',
      value: `${rainfall.blendedValue}`,
      unit: 'mm',
      icon: CloudRain,
      color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-400',
      textColor: 'text-cyan-400',
      data: rainfall
    },
    {
      id: 'max_temp' as ForecastVariable,
      title: 'Maximum Temperature',
      value: `${maxTemp.blendedValue}`,
      unit: '°C',
      icon: ThermometerSun,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400',
      textColor: 'text-amber-400',
      data: maxTemp
    },
    {
      id: 'min_temp' as ForecastVariable,
      title: 'Minimum Temperature',
      value: `${minTemp.blendedValue}`,
      unit: '°C',
      icon: ThermometerSnowflake,
      color: 'from-indigo-500/20 to-sky-500/20 border-indigo-500/40 text-sky-400',
      textColor: 'text-sky-400',
      data: minTemp
    },
    {
      id: 'wind_speed' as ForecastVariable,
      title: 'Surface Wind (10m)',
      value: `${windSpeed.blendedValue}`,
      unit: 'km/h',
      icon: Wind,
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/40 text-teal-400',
      textColor: 'text-teal-400',
      data: windSpeed
    }
  ];

  const activeData = cards.find(c => c.id === activeVariable)?.data || rainfall;

  return (
    <div id="blended-forecast-section" className="space-y-4">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Dynamically Blended Target Outputs
          </h2>
          <p className="text-xs text-slate-400">
            Optimal multi-model weighted consensus with debiasing and ensemble spread
          </p>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Click any card to inspect model weights & lead-time curves</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeVariable === card.id;

          return (
            <button
              key={card.id}
              id={`card-variable-${card.id}`}
              type="button"
              onClick={() => onSelectVariable(card.id)}
              className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden border ${
                isSelected 
                  ? `bg-gradient-to-b ${card.color} ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-900/20 scale-[1.02]`
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-slate-800/80 ${card.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Big Blended Value */}
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                  {card.value}
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  {card.unit}
                </span>
              </div>

              {/* 10th-90th Percentile Confidence Interval */}
              <div className="text-[11px] text-slate-400 mb-3 font-mono flex items-center justify-between">
                <span>90% CI: [{card.data.confidenceInterval[0]} - {card.data.confidenceInterval[1]} {card.unit}]</span>
                <span className="text-slate-500">±{card.data.ensembleSpreadStd}</span>
              </div>

              {/* Verified Skill Gain Badge vs Best Single Model */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 truncate">
                  vs {card.data.baselineComparison.bestSingleModelName.split(' ')[0]} ({card.data.baselineComparison.bestSingleModelValue}{card.unit})
                </span>
                <span className="font-bold text-emerald-400 flex items-center gap-0.5 shrink-0">
                  <TrendingUp className="w-3 h-3" />
                  +{card.data.baselineComparison.skillImprovementPct}% Skill
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expanded Multi-Model Breakdown for Active Variable */}
      <div id="active-variable-breakdown" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Model Contribution & Bias Correction Matrix:</span>
              <span className="text-cyan-400 font-mono">{activeData.variableLabel}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparing raw single-model forecasts against regional bias-corrected inputs and optimized adaptive weights
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <span className="text-slate-400">Blended Synthesis:</span>
            <span className="text-white font-bold">{activeData.blendedValue} {activeData.unit}</span>
            <span className="text-emerald-400 font-bold">(+{activeData.baselineComparison.skillImprovementPct}% boost)</span>
          </div>
        </div>

        {/* 6 Models Comparison Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {activeData.models.map((model) => {
            const isTopModel = model.skillRank === 1;
            const weightPercent = Math.round(model.dynamicWeight * 100);

            return (
              <div
                key={model.modelId}
                id={`model-contrib-${model.modelId}`}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                  isTopModel
                    ? 'bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-950'
                    : 'bg-slate-850/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Model Name & Category */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white truncate" title={model.modelName}>
                      {model.modelName}
                    </span>
                    <span 
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-semibold ${
                        model.type === 'AI_DATA_DRIVEN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : (model.type === 'REGIONAL_NWP' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30')
                      }`}
                    >
                      {model.type === 'AI_DATA_DRIVEN' ? 'AI' : (model.type === 'REGIONAL_NWP' ? 'Regional' : 'NWP')}
                    </span>
                  </div>

                  {/* Weight progress pill */}
                  <div className="mb-2">
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-slate-400">Weight:</span>
                      <span className="text-cyan-400 font-bold">{weightPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${weightPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Raw vs Bias Corrected */}
                  <div className="space-y-1 text-xs font-mono py-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Raw Forecast:</span>
                      <span className="text-slate-200">{model.rawForecast} {activeData.unit}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Bias Offset:</span>
                      <span className={model.biasOffset > 0 ? 'text-amber-400' : (model.biasOffset < 0 ? 'text-sky-400' : 'text-slate-400')}>
                        {model.biasOffset > 0 ? `+${model.biasOffset}` : `${model.biasOffset}`} {activeData.unit}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-200 pt-1 border-t border-slate-800">
                      <span>Calibrated:</span>
                      <span className="text-white">{model.biasCorrectedForecast} {activeData.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Rank & Historical RMSE */}
                <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>RMSE: {model.historicalRmse}</span>
                  {isTopModel ? (
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Top Skill
                    </span>
                  ) : (
                    <span>Rank #{model.skillRank}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
