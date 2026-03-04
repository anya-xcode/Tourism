import mongoose, { Schema, Document } from 'mongoose';
import { EventVisibility, EventStatus } from '../types';

export interface IVisitEvent extends Document {
  placeId: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  scheduledDate: Date;
  time: string;
  maxParticipants: number;
  visibility: EventVisibility;
  status: EventStatus;
  createdAt: Date;
}

const VisitEventSchema = new Schema<IVisitEvent>(
  {
    placeId: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    scheduledDate: { type: Date, required: true },
    time: { type: String, required: true },
    maxParticipants: { type: Number, default: 10 },
    visibility: { type: String, enum: Object.values(EventVisibility), default: EventVisibility.OPEN },
    status: { type: String, enum: Object.values(EventStatus), default: EventStatus.UPCOMING },
  },
  { timestamps: true }
);

VisitEventSchema.index({ scheduledDate: 1 });
VisitEventSchema.index({ placeId: 1 });
VisitEventSchema.index({ creatorId: 1 });

export default mongoose.model<IVisitEvent>('VisitEvent', VisitEventSchema);
