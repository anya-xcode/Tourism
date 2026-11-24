import mongoose from 'mongoose';
import Place from '../models/Place';
import Review from '../models/Review';
import User from '../models/User';
import Bookmark from '../models/Bookmark';

export interface CityCount {
  city: string;
  count: number;
}

export interface CommunityStats {
  places: number;
  cities: number;
  reviews: number;
  travelers: number;
  topCities: CityCount[];
  /** True while seeded sample accounts exist, so the UI can say the numbers include sample data */
  sample: boolean;
}

export interface UserStats {
  placesAdded: number;
  reviews: number;
  bookmarks: number;
}

/**
 * StatsService — real, computed counts for the UI.
 * Replaces hardcoded marketing numbers on the frontend.
 */
export class StatsService {
  async getCommunityStats(): Promise<CommunityStats> {
    const [places, cityGroups, reviews, travelers, sample] = await Promise.all([
      Place.countDocuments(),
      // City names are free text, so group case-insensitively and keep one display spelling
      Place.aggregate<{ _id: string; city: string; count: number }>([
        { $group: { _id: { $toLower: { $trim: { input: '$city' } } }, city: { $first: '$city' }, count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]),
      Review.countDocuments(),
      User.countDocuments(),
      User.exists({ isSample: true }),
    ]);
    return {
      places,
      cities: cityGroups.length,
      reviews,
      travelers,
      topCities: cityGroups.slice(0, 12).map((g) => ({ city: g.city.trim(), count: g.count })),
      sample: Boolean(sample),
    };
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const id = new mongoose.Types.ObjectId(userId);
    const [placesAdded, reviews, bookmarks] = await Promise.all([
      Place.countDocuments({ addedBy: id }),
      Review.countDocuments({ userId: id }),
      Bookmark.countDocuments({ userId: id }),
    ]);
    return { placesAdded, reviews, bookmarks };
  }
}
