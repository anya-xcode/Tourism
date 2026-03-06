import { RideFareContext, UberFareStrategy, OlaFareStrategy, RapidoFareStrategy } from '../patterns/RideFareStrategy';
import RideComparison from '../models/RideComparison';
import { GeoLocation, FareEstimate } from '../types';
import mongoose from 'mongoose';

export class RideService {
  private rideContext: RideFareContext;

  constructor() {
    this.rideContext = new RideFareContext();
    this.rideContext.addStrategy(new UberFareStrategy());
    this.rideContext.addStrategy(new OlaFareStrategy());
    this.rideContext.addStrategy(new RapidoFareStrategy());
  }

  async compareFares(
    origin: GeoLocation,
    destination: GeoLocation,
    userId: string
  ): Promise<FareEstimate[]> {
    const estimates = await this.rideContext.compareAllFares(origin, destination);

    // Save history for analytic/caching purposes
    const historyEntries = estimates.map((est) => ({
      userId: new mongoose.Types.ObjectId(userId),
      originLat: origin.latitude,
      originLng: origin.longitude,
      destLat: destination.latitude,
      destLng: destination.longitude,
      provider: est.provider,
      estimatedFare: est.fare,
      estimatedMinutes: est.estimatedMinutes,
      distanceKm: est.distanceKm,
    }));

    await RideComparison.insertMany(historyEntries);

    return estimates;
  }
}
