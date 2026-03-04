import mongoose, { Schema, Document } from 'mongoose';

export interface IReel extends Document {
  userId: mongoose.Types.ObjectId;
  placeId: mongoose.Types.ObjectId;
  videoUrl: string;
  cloudinaryPublicId: string;
  caption: string;
  thumbnailUrl: string;
  views: number;
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  saves: number;
  createdAt: Date;
}

const ReelSchema = new Schema<IReel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    placeId: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    videoUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    caption: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    saves: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ReelSchema.index({ createdAt: -1 });
ReelSchema.index({ views: -1 });
ReelSchema.index({ placeId: 1 });

export default mongoose.model<IReel>('Reel', ReelSchema);
