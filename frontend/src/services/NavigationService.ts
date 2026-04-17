import { BaseService } from './BaseService';

/**
 * NavigationService — OOP class for Navigation / Distance API.
 * Calculates distance and travel time between two geo-points.
 */
class NavigationServiceClass extends BaseService {
  constructor() {
    super('/navigation');
  }

  public async getDistance(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ): Promise<{ distance: { text: string; value: number }; duration: { text: string; value: number } }> {
    return this.get('/distance', { originLat, originLng, destLat, destLng });
  }
}

/** Singleton instance */
export const NavigationService = new NavigationServiceClass();
