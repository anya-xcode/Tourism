import { BaseService } from './BaseService';
import type { IFareEstimate } from '../types';

/**
 * RideService — OOP class for Ride Fare Comparison API.
 * Compares fare estimates across multiple ride providers.
 */
class RideServiceClass extends BaseService {
  constructor() {
    super('/rides');
  }

  public async compareFares(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): Promise<IFareEstimate[]> {
    return this.post<IFareEstimate[]>('/compare', { origin, destination });
  }
}

/** Singleton instance */
export const RideService = new RideServiceClass();
