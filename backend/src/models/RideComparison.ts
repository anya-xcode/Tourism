import mongoose, { Schema, Document } from 'mongoose';
import { RideProvider } from '../types';

export interface IRideComparison extends Document {
  userId: mongoose.Types.ObjectId;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  provider: RideProvider;
  estimatedFare: number;
  estimatedMinutes: number;
  distanceKm: number;
  queriedAt: Date;
}

const RideComparisonSchema = new Schema<IRideComparison>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    originLat: { type: Number, required: true },
    originLng: { type: Number, required: true },
    destLat: { type: Number, required: true },
    destLng: { type: Number, required: true },
    provider: { type: String, enum: Object.values(RideProvider), required: true },
    estimatedFare: { type: Number, required: true },
    estimatedMinutes: { type: Number, required: true },
    distanceKm: { type: Number, required: true },
    queriedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

RideComparisonSchema.index({ userId: 1, queriedAt: -1 });

export default mongoose.model<IRideComparison>('RideComparison', RideComparisonSchema);
