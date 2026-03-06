import Thread, { IThread } from '../models/Thread';
import ThreadReply, { IThreadReply } from '../models/ThreadReply';
import { ThreadComposite, ReplyLeaf, IThreadComponent } from '../patterns/CompositeThread';
import { CreateThreadDTO, CreateReplyDTO } from '../types';
import mongoose from 'mongoose';
import { AppError } from '../middleware/error';

export class ThreadService {
  async createThread(data: CreateThreadDTO, userId: string): Promise<IThread> {
    return Thread.create({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
      placeId: new mongoose.Types.ObjectId(data.placeId),
    });
  }

  async createReply(data: CreateReplyDTO, userId: string): Promise<IThreadReply> {
    const thread = await Thread.findById(data.threadId);
    if (!thread) throw new AppError('Thread not found', 404);

    return ThreadReply.create({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
      threadId: new mongoose.Types.ObjectId(data.threadId),
    });
  }

  /**
   * Returns threads for a place, leveraging the Composite pattern to structure
   * threads and their replies as a uniform tree for easier frontend processing.
   */
  async getThreadsByPlace(placeId: string): Promise<any[]> {
    const threads = await Thread.find({ placeId })
      .populate('userId', 'name avatar')
      .sort('-createdAt');

    const result = await Promise.all(
      threads.map(async (t) => {
        const replies = await ThreadReply.find({ threadId: t._id })
          .populate('userId', 'name avatar')
          .sort('createdAt');

        const composite = new ThreadComposite(
          t._id.toString(),
          t.content,
          t.userId._id.toString(),
          (t.userId as any).name,
          t.placeId.toString(),
          t.mediaUrls,
          t.createdAt
        );

        replies.forEach((r) => {
          composite.add(
            new ReplyLeaf(
              r._id.toString(),
              r.content,
              r.userId._id.toString(),
              (r.userId as any).name,
              r.createdAt
            )
          );
        });

        return composite.toJSON();
      })
    );

    return result;
  }
}
