import mongoose, { Schema } from 'mongoose';

const ForecastSnapshotSchema = new Schema({
  subdivisionId: { type: String, required: true, index: true },
  subdivisionName: { type: String, required: true },
  fetchedAt: { type: Date, required: true },
  payload: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true });

ForecastSnapshotSchema.index({ subdivisionId: 1, fetchedAt: -1 });

export const ForecastSnapshot = mongoose.models.ForecastSnapshot || mongoose.model('ForecastSnapshot', ForecastSnapshotSchema);
