import { Response } from 'express';
import { AuthRequest } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class PlaceController {
  private placeService = ServiceFactory.getInstance().getPlaceService();

  createPlace = async (req: AuthRequest, res: Response) => {
    const place = await this.placeService.createPlace(req.body, req.user!.id);
    res.status(201).json(place);
  };

  getPlaces = async (req: AuthRequest, res: Response) => {
    const filters = {
      city: req.query.city as string,
      category: req.query.category as any,
      budgetRange: req.query.budgetRange as any,
      search: req.query.search as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 12,
    };
    const result = await this.placeService.getPlaces(filters);
    res.status(200).json(result);
  };

  getPlaceById = async (req: AuthRequest, res: Response) => {
    const place = await this.placeService.getPlaceById(req.params.id);
    res.status(200).json(place);
  };

  getNearby = async (req: AuthRequest, res: Response) => {
    const { lat, lng, radius } = req.query;
    const places = await this.placeService.getNearbyPlaces(
      parseFloat(lat as string),
      parseFloat(lng as string),
      parseFloat(radius as string) || 5
    );
    res.status(200).json(places);
  };
}
