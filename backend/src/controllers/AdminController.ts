import { Response } from 'express';
import { AuthRequest, FlagTargetType } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class AdminController {
  private flagService = ServiceFactory.getInstance().getFlagService();

  reportContent = async (req: AuthRequest, res: Response) => {
    const { targetType, targetId, reason } = req.body;
    const report = await this.flagService.reportContent(req.user!.id, targetType as FlagTargetType, targetId, reason);
    res.status(201).json(report);
  };

  getPendingFlags = async (req: AuthRequest, res: Response) => {
    const reports = await this.flagService.getPendingReports();
    res.status(200).json(reports);
  };

  resolveFlag = async (req: AuthRequest, res: Response) => {
    const { action } = req.body;
    const report = await this.flagService.resolveReport(req.params.id, req.user!.id, action);
    res.status(200).json(report);
  };
}
