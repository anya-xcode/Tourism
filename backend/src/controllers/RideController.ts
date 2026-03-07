import { Response } from 'express';
import { AuthRequest } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class RideController {
  private rideService = ServiceFactory.getInstance().getRideService();

  compareFares = async (req: AuthRequest, res: Response) => {
    const { origin, destination } = req.body;
    const estimates = await this.rideService.compareFares(origin, destination, req.user!.id);
    res.status(200).json(estimates);
  };
}
