import { Response } from 'express';
import { AuthRequest } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class StatsController {
  private statsService = ServiceFactory.getInstance().getStatsService();

  getCommunityStats = async (req: AuthRequest, res: Response) => {
    const stats = await this.statsService.getCommunityStats();
    res.status(200).json(stats);
  };

  getMyStats = async (req: AuthRequest, res: Response) => {
    const stats = await this.statsService.getUserStats(req.user!.id);
    res.status(200).json(stats);
  };
}
