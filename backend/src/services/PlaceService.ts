import Place, { IPlace } from '../models/Place';
import { CreatePlaceDTO, UpdatePlaceDTO, PlaceFilters } from '../types';
import { AppError } from '../middleware/error';
import mongoose from 'mongoose';

export class PlaceService {
  async createPlace(data: CreatePlaceDTO, userId: string): Promise<IPlace> {
    const place = await Place.create({
      ...data,
      location: {
        type: 'Point',
        coordinates: [data.longitude, data.latitude],
      },
      addedBy: new mongoose.Types.ObjectId(userId),
    });
    return place;
  }

  async getPlaces(filters: PlaceFilters): Promise<{ places: IPlace[]; total: number }> {
    const query: any = {};

    if (filters.city) query.city = new RegExp(filters.city, 'i');
    if (filters.category) query.category = filters.category;
    if (filters.budgetRange) query.budgetRange = filters.budgetRange;
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $all: filters.tags };
    }
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const places = await Place.find(query)
      .sort(filters.sortBy || '-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Place.countDocuments(query);

    return { places, total };
  }

  async getPlaceById(id: string): Promise<IPlace> {
    const place = await Place.findById(id).populate('addedBy', 'name avatar');
    if (!place) throw new AppError('Place not found', 404);
    return place;
  }

  async updatePlace(id: string, data: UpdatePlaceDTO): Promise<IPlace> {
    const place = await Place.findByIdAndUpdate(id, data, { new: true });
    if (!place) throw new AppError('Place not found', 404);
    return place;
  }

  async getNearbyPlaces(lat: number, lng: number, radiusKm: number = 5): Promise<IPlace[]> {
    return Place.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000,
        },
      },
    });
  }
}
