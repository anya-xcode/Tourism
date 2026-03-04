import mongoose, { Schema, Document } from 'mongoose';

export interface IThreadReply extends Document {
  threadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const ThreadReplySchema = new Schema<IThreadReply>(
  {
    threadId: { type: Schema.Types.ObjectId, ref: 'Thread', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

ThreadReplySchema.index({ threadId: 1, createdAt: 1 });

export default mongoose.model<IThreadReply>('ThreadReply', ThreadReplySchema);
