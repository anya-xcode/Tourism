import { Response } from 'express';
import { AuthRequest } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class NavigationController {
  private navService = ServiceFactory.getInstance().getNavigationService();

  getDistance = async (req: AuthRequest, res: Response) => {
    const { originLat, originLng, destLat, destLng } = req.query;
    const result = await this.navService.getDistance(
      { latitude: parseFloat(originLat as string), longitude: parseFloat(originLng as string) },
      { latitude: parseFloat(destLat as string), longitude: parseFloat(destLng as string) }
    );
    res.status(200).json(result);
  };
}
