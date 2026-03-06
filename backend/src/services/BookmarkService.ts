import Bookmark, { IBookmark } from '../models/Bookmark';
import { BookmarkType } from '../types';
import mongoose from 'mongoose';

export class BookmarkService {
  async toggleBookmark(
    userId: string,
    targetId: string,
    type: BookmarkType
  ): Promise<{ bookmarked: boolean }> {
    const query: any = { userId: new mongoose.Types.ObjectId(userId), type };
    if (type === BookmarkType.PLACE) query.placeId = new mongoose.Types.ObjectId(targetId);
    else query.reelId = new mongoose.Types.ObjectId(targetId);

    const existing = await Bookmark.findOne(query);

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return { bookmarked: false };
    } else {
      await Bookmark.create(query);
      return { bookmarked: true };
    }
  }

  async getBookmarks(userId: string, type?: BookmarkType): Promise<IBookmark[]> {
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (type) query.type = type;

    return Bookmark.find(query)
      .populate('placeId', 'name city photos category averageRating')
      .populate('reelId', 'caption videoUrl thumbnailUrl')
      .sort('-createdAt');
  }
}
