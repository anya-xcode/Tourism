import { Response } from 'express';
import { AuthRequest } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class AIServiceController {
  private aiService = ServiceFactory.getInstance().getAIService();

  getRecommendations = async (req: AuthRequest, res: Response) => {
    const city = req.query.city as string;
    const recommendations = await this.aiService.getRecommendations(req.user!.id, city);
    res.status(200).json(recommendations);
  };

  checkDuplicate = async (req: AuthRequest, res: Response) => {
    const { name, latitude, longitude } = req.body;
    const result = await this.aiService.checkDuplicate(name, { latitude, longitude });
    res.status(200).json(result);
  };
}
