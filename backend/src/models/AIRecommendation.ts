import mongoose, { Schema, Document } from 'mongoose';
import { RecommendationType } from '../types';

export interface IAIRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  placeId: mongoose.Types.ObjectId;
  score: number;
  reason: string;
  type: RecommendationType;
  generatedAt: Date;
}

const AIRecommendationSchema = new Schema<IAIRecommendation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    placeId: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    score: { type: Number, required: true },
    reason: { type: String, required: true },
    type: { type: String, enum: Object.values(RecommendationType), required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AIRecommendationSchema.index({ userId: 1, score: -1 });

export default mongoose.model<IAIRecommendation>('AIRecommendation', AIRecommendationSchema);
