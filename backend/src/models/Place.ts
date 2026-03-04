import mongoose, { Schema, Document } from 'mongoose';
import { PlaceCategory, BudgetRange } from '../types';

export interface IPlace extends Document {
  name: string;
  description: string;
  location: {
    type: string;
    coordinates: number[];
  };
  address: string;
  city: string;
  category: PlaceCategory;
  budgetRange: BudgetRange;
  operatingHours: string;
  suggestedDurationMinutes: number;
  tags: string[];
  photos: string[];
  averageRating: number;
  totalReviews: number;
  addedBy: mongoose.Types.ObjectId;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema = new Schema<IPlace>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    category: { type: String, enum: Object.values(PlaceCategory), required: true },
    budgetRange: { type: String, enum: Object.values(BudgetRange), required: true },
    operatingHours: { type: String, default: '9:00 AM - 6:00 PM' },
    suggestedDurationMinutes: { type: Number, default: 60 },
    tags: [{ type: String }],
    photos: [{ type: String }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PlaceSchema.index({ location: '2dsphere' });
PlaceSchema.index({ name: 'text', description: 'text', tags: 'text' });
PlaceSchema.index({ category: 1, city: 1 });
PlaceSchema.index({ averageRating: -1 });

export default mongoose.model<IPlace>('Place', PlaceSchema);
