import mongoose, { Schema, Document } from 'mongoose';
import { MediaType } from '../types';

export interface IMedia extends Document {
  userId: mongoose.Types.ObjectId;
  placeId: mongoose.Types.ObjectId;
  type: MediaType;
  url: string;
  cloudinaryPublicId: string;
  caption: string;
  tags: string[];
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    placeId: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    type: { type: String, enum: Object.values(MediaType), required: true },
    url: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    caption: { type: String, default: '' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

MediaSchema.index({ placeId: 1, createdAt: -1 });

export default mongoose.model<IMedia>('Media', MediaSchema);
