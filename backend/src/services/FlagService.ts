import FlagReport, { IFlagReport } from '../models/FlagReport';
import { FlagTargetType, FlagStatus } from '../types';
import mongoose from 'mongoose';
import { AppError } from '../middleware/error';

export class FlagService {
  async reportContent(
    reportedBy: string,
    targetType: FlagTargetType,
    targetId: string,
    reason: string
  ): Promise<IFlagReport> {
    return FlagReport.create({
      reportedBy: new mongoose.Types.ObjectId(reportedBy),
      targetType,
      targetId: new mongoose.Types.ObjectId(targetId),
      reason,
    });
  }

  async getPendingReports(): Promise<IFlagReport[]> {
    return FlagReport.find({ status: FlagStatus.PENDING })
      .populate('reportedBy', 'name email')
      .sort('-createdAt');
  }

  async resolveReport(
    reportId: string,
    adminId: string,
    action: 'dismiss' | 'remove'
  ): Promise<IFlagReport> {
    const report = await FlagReport.findById(reportId);
    if (!report) throw new AppError('Report not found', 404);

    report.status = FlagStatus.RESOLVED;
    report.resolvedBy = new mongoose.Types.ObjectId(adminId);
    report.resolvedAt = new Date();

    if (action === 'remove') {
      // Logic for actual content removal would go here based on targetType
      console.log(`Removing ${report.targetType} with ID ${report.targetId}`);
    }

    await report.save();
    return report;
  }
}
