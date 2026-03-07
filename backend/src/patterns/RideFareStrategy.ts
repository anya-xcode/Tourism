import { GeoLocation, FareEstimate, RideProvider } from '../types';

/**
 * Strategy Pattern — Ride Fare Estimation
 * Each ride provider implements its own fare calculation strategy.
 * New providers can be added without modifying existing code (Open/Closed Principle).
 */
export interface IRideFareStrategy {
  provider: RideProvider;
  calculateFare(origin: GeoLocation, destination: GeoLocation): Promise<FareEstimate>;
}

/**
 * Calculates distance between two geo points using Haversine formula
 */
function haversineDistance(origin: GeoLocation, dest: GeoLocation): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((dest.latitude - origin.latitude) * Math.PI) / 180;
  const dLng = ((dest.longitude - origin.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.latitude * Math.PI) / 180) *
      Math.cos((dest.latitude * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class UberFareStrategy implements IRideFareStrategy {
  provider = RideProvider.UBER;

  async calculateFare(origin: GeoLocation, destination: GeoLocation): Promise<FareEstimate> {
    const distanceKm = haversineDistance(origin, destination);
    const baseFare = 50;
    const perKmRate = 12;
    const perMinRate = 2;
    const estimatedMinutes = Math.round((distanceKm / 30) * 60); // avg 30km/h city speed
    const fare = Math.round(baseFare + distanceKm * perKmRate + estimatedMinutes * perMinRate);

    return {
      provider: this.provider,
      fare,
      estimatedMinutes,
      distanceKm: Math.round(distanceKm * 10) / 10,
    };
  }
}

export class OlaFareStrategy implements IRideFareStrategy {
  provider = RideProvider.OLA;

  async calculateFare(origin: GeoLocation, destination: GeoLocation): Promise<FareEstimate> {
    const distanceKm = haversineDistance(origin, destination);
    const baseFare = 40;
    const perKmRate = 10;
    const perMinRate = 1.5;
    const estimatedMinutes = Math.round((distanceKm / 28) * 60);
    const fare = Math.round(baseFare + distanceKm * perKmRate + estimatedMinutes * perMinRate);

    return {
      provider: this.provider,
      fare,
      estimatedMinutes,
      distanceKm: Math.round(distanceKm * 10) / 10,
    };
  }
}

export class RapidoFareStrategy implements IRideFareStrategy {
  provider = RideProvider.RAPIDO;

  async calculateFare(origin: GeoLocation, destination: GeoLocation): Promise<FareEstimate> {
    const distanceKm = haversineDistance(origin, destination);
    const baseFare = 25;
    const perKmRate = 7;
    const perMinRate = 1;
    const estimatedMinutes = Math.round((distanceKm / 25) * 60);
    const fare = Math.round(baseFare + distanceKm * perKmRate + estimatedMinutes * perMinRate);

    return {
      provider: this.provider,
      fare,
      estimatedMinutes,
      distanceKm: Math.round(distanceKm * 10) / 10,
    };
  }
}

/**
 * Context class that uses a strategy
 */
export class RideFareContext {
  private strategies: IRideFareStrategy[] = [];

  addStrategy(strategy: IRideFareStrategy): void {
    this.strategies.push(strategy);
  }

  async compareAllFares(origin: GeoLocation, destination: GeoLocation): Promise<FareEstimate[]> {
    const results = await Promise.all(
      this.strategies.map((strategy) => strategy.calculateFare(origin, destination))
    );
    return results.sort((a, b) => a.fare - b.fare);
  }
}
