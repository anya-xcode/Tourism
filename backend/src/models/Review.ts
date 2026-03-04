import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  placeId: mongoose.Types.ObjectId;
  rating: number;
  text: string;
  photos: string[];
  helpfulVotes: number;
  votedBy: mongoose.Types.ObjectId[];
  visitDate: Date;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    placeId: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    photos: [{ type: String }],
    helpfulVotes: { type: Number, default: 0 },
    votedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    visitDate: { type: Date },
  },
  { timestamps: true }
);

ReviewSchema.index({ placeId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
