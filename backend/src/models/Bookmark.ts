import mongoose, { Schema, Document } from 'mongoose';
import { BookmarkType } from '../types';

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  placeId?: mongoose.Types.ObjectId;
  reelId?: mongoose.Types.ObjectId;
  type: BookmarkType;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    placeId: { type: Schema.Types.ObjectId, ref: 'Place' },
    reelId: { type: Schema.Types.ObjectId, ref: 'Reel' },
    type: { type: String, enum: Object.values(BookmarkType), required: true },
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, type: 1 });
BookmarkSchema.index({ userId: 1, placeId: 1 }, { unique: true, sparse: true });
BookmarkSchema.index({ userId: 1, reelId: 1 }, { unique: true, sparse: true });

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
