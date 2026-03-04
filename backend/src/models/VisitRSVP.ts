import mongoose, { Schema, Document } from 'mongoose';
import { RSVPStatus } from '../types';

export interface IVisitRSVP extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: RSVPStatus;
  respondedAt: Date;
}

const VisitRSVPSchema = new Schema<IVisitRSVP>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'VisitEvent', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(RSVPStatus), default: RSVPStatus.GOING },
    respondedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VisitRSVPSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IVisitRSVP>('VisitRSVP', VisitRSVPSchema);
