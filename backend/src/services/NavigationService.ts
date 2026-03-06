import axios from 'axios';
import { GeoLocation } from '../types';
import { AppError } from '../middleware/error';

export class NavigationService {
  private apiKey = process.env.GOOGLE_MAPS_API_KEY;

  async getDistance(origin: GeoLocation, destination: GeoLocation): Promise<any> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json`,
        {
          params: {
            origins: `${origin.latitude},${origin.longitude}`,
            destinations: `${destination.latitude},${destination.longitude}`,
            key: this.apiKey,
          },
        }
      );

      if (response.data.status !== 'OK') {
        throw new AppError('Maps API error', 500);
      }

      return response.data.rows[0].elements[0];
    } catch (error) {
      console.error('Maps API error:', error);
      // Fallback to haversine if API fails or key is missing for demo
      const distance = this.haversineDistance(origin, destination);
      return {
        distance: { text: `${distance.toFixed(1)} km`, value: Math.round(distance * 1000) },
        duration: { text: `${Math.round(distance * 2)} mins`, value: Math.round(distance * 120) },
        status: 'OK',
      };
    }
  }

  private haversineDistance(origin: GeoLocation, dest: GeoLocation): number {
    const R = 6371;
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
}
