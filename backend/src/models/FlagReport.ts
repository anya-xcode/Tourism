import mongoose, { Schema, Document } from 'mongoose';
import { FlagTargetType, FlagStatus } from '../types';

export interface IFlagReport extends Document {
  reportedBy: mongoose.Types.ObjectId;
  targetType: FlagTargetType;
  targetId: mongoose.Types.ObjectId;
  reason: string;
  status: FlagStatus;
  resolvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  resolvedAt?: Date;
}

const FlagReportSchema = new Schema<IFlagReport>(
  {
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: Object.values(FlagTargetType), required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: Object.values(FlagStatus), default: FlagStatus.PENDING },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

FlagReportSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IFlagReport>('FlagReport', FlagReportSchema);
