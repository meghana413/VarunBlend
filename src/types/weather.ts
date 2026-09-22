export type ModelType = 'NWP_PHYSICAL' | 'AI_DATA_DRIVEN' | 'REGIONAL_NWP';

export type ModelId = 'ecmwf' | 'gfs' | 'ncum' | 'graphcast' | 'pangu' | 'fourcastnet';

export interface ModelMeta {
  id: ModelId;
  name: string;
  provider: string;
  type: ModelType;
  resolution: string;
  updateCycle: string;
  color: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}

export type Season = 'monsoon' | 'post_monsoon' | 'winter' | 'pre_monsoon';

export type WeatherRegime = 
  | 'monsoon_active' 
  | 'monsoon_break' 
  | 'western_disturbance' 
  | 'cyclone_depression' 
  | 'normal_fair';

export type BlendingAlgorithm = 
  | 'inverse_variance' 
  | 'bayesian_bma' 
  | 'ml_stacking' 
  | 'equal_weight';

export type ForecastVariable = 'rainfall' | 'max_temp' | 'min_temp' | 'wind_speed';

export type RegionZone = 'Northwest' | 'Central' | 'East & Northeast' | 'South Peninsular' | 'Islands';

export interface Subdivision {
  id: string;
  name: string;
  code: string;
  zone: RegionZone;
  states: string[];
  centerLat: number;
  centerLon: number;
  svgPath?: string; // For map representation
  terrain: 'coastal' | 'ghats' | 'plains' | 'arid' | 'himalayan' | 'plateau' | 'island';
  normalMonsoonRainfallMm: number;
  vulnerabilities: string[];
}

export interface ModelContribution {
  modelId: ModelId;
  modelName: string;
  type: ModelType;
  color: string;
  rawForecast: number;
  biasOffset: number;
  biasCorrectedForecast: number;
  dynamicWeight: number; // 0.0 - 1.0
  historicalRmse: number;
  skillRank: number;
}

export interface BlendedForecastOutput {
  variable: ForecastVariable;
  variableLabel: string;
  unit: string;
  blendedValue: number;
  ensembleSpreadStd: number;
  confidenceInterval: [number, number]; // 10th and 90th percentile
  models: ModelContribution[];
  baselineComparison: {
    bestSingleModelId: ModelId;
    bestSingleModelName: string;
    bestSingleModelValue: number;
    bestSingleModelRmse: number;
    blendedRmse: number;
    skillImprovementPct: number; // e.g. 18.5%
  };
}

export type AlertLevel = 'green' | 'yellow' | 'orange' | 'red';

export interface ExceedanceProb {
  threshold: string;
  value: number;
  probability: number; // 0 - 100%
  alertTriggered: AlertLevel;
}

export interface ExtremeWeatherSignal {
  level: AlertLevel;
  category: 'rainfall' | 'heatwave' | 'gale_wind' | 'composite';
  badge: string;
  headline: string;
  synopticDiagnosis: string;
  exceedanceProbabilities: ExceedanceProb[];
  actionAdvisory: {
    public: string;
    agriculture: string;
    disasterAgency: string;
  };
}

export interface VerificationMetric {
  leadDay: number;
  ecmwfRmse: number;
  gfsRmse: number;
  ncumRmse: number;
  graphcastRmse: number;
  panguRmse: number;
  fourcastnetRmse: number;
  blendedRmse: number;
  improvementOverBestSingle: number; // percentage
  threatScoreHeavyRainBlended: number;
  threatScoreHeavyRainBestSingle: number;
}

export interface DivergenceInfo {
  index: number; // 0.0 - 1.0 normalized
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  earlyWarningSignal: boolean;
  spreadStd: number;
  explanation: string;
  divergenceDrivers: {
    nwpMean: number;
    aiMean: number;
    spreadGap: number;
  };
}

export interface LiveTrustScore {
  modelId: ModelId;
  modelName: string;
  color: string;
  score: number; // 0 - 100
  previousScore: number;
  recentError: number; // mm
  weightInBlend: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export interface PlainLanguageAdvisory {
  sentence: string;
  riskTier: 'CRITICAL' | 'ELEVATED' | 'WATCH' | 'ROUTINE';
  driver: string;
  actionDirective: string;
}

export interface ReplayTimelineStep {
  dayNumber: number;
  dateStr: string;
  synopticSituation: string;
  observedRainfall: number;
  modelForecasts: Record<ModelId, number>;
  blendedForecast: number;
  divergenceIndex: number;
  trustScores: Record<ModelId, number>;
  advisory: string;
  earlyWarningFired: boolean;
}

export interface PipelineStageLog {
  id: string;
  stageName: string;
  status: 'pending' | 'running' | 'completed' | 'warning';
  timestamp: string;
  durationMs: number;
  details: string;
}

export interface PipelineRunStatus {
  runId: string;
  cycle: '00Z' | '12Z';
  initiatedAt: string;
  completedAt?: string;
  state: 'idle' | 'executing' | 'success' | 'failed';
  stages: PipelineStageLog[];
  totalModelsIngested: number;
  subdivisionsProcessed: number;
  activeAlertsGenerated: { red: number; orange: number; yellow: number; green: number };
}
