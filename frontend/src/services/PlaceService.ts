import { BaseService } from './BaseService';
import type { IPlace, PlaceFilters } from '../types';

/**
 * PlaceService — OOP class for Place API operations.
 * Extends BaseService for encapsulated HTTP handling.
 */
class PlaceServiceClass extends BaseService {
  constructor() {
    super('/places');
  }

  public async getPlaces(filters?: PlaceFilters): Promise<{ places: IPlace[]; total: number }> {
    return this.get<{ places: IPlace[]; total: number }>('', filters as any);
  }

  public async getPlaceById(id: string): Promise<IPlace> {
    return this.get<IPlace>(`/${id}`);
  }

  public async getNearby(lat: number, lng: number, radius?: number): Promise<IPlace[]> {
    return this.get<IPlace[]>('/nearby', { lat, lng, radius });
  }

  public async createPlace(data: Record<string, any>): Promise<IPlace> {
    return this.post<IPlace>('', data);
  }
}

/** Singleton instance */
export const PlaceService = new PlaceServiceClass();
