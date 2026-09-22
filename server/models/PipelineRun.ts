import mongoose, { Schema } from 'mongoose';

const PipelineRunSchema = new Schema({
  runId: { type: String, required: true, unique: true },
  cycle: { type: String, enum: ['00Z', '12Z'], required: true },
  state: { type: String, enum: ['success', 'failed'], required: true },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date, required: true },
  metrics: { type: Schema.Types.Mixed, required: true },
  topAlerts: { type: [Schema.Types.Mixed], required: true }
}, { timestamps: true });

export const PipelineRun = mongoose.models.PipelineRun || mongoose.model('PipelineRun', PipelineRunSchema);
