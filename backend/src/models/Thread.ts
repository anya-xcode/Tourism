import mongoose, { Schema, Document } from 'mongoose';

export interface IThread extends Document {
  placeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  mediaUrls: string[];
  createdAt: Date;
}

const ThreadSchema = new Schema<IThread>(
  {
    placeId: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    mediaUrls: [{ type: String }],
  },
  { timestamps: true }
);

ThreadSchema.index({ placeId: 1, createdAt: -1 });

export default mongoose.model<IThread>('Thread', ThreadSchema);
