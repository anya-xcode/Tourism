import { BaseService } from './BaseService';
import type { IReview } from '../types';

/**
 * ReviewService — OOP class for Review API operations.
 * Handles fetching reviews, creating new reviews, and voting helpful.
 */
class ReviewServiceClass extends BaseService {
  constructor() {
    super('/reviews');
  }

  public async getByPlace(placeId: string): Promise<IReview[]> {
    return this.get<IReview[]>(`/place/${placeId}`);
  }

  public async create(data: { placeId: string; rating: number; text: string; visitDate?: string }): Promise<IReview> {
    return this.post<IReview>('', data);
  }

  public async voteHelpful(reviewId: string): Promise<IReview> {
    return this.post<IReview>(`/${reviewId}/helpful`);
  }
}

/** Singleton instance */
export const ReviewService = new ReviewServiceClass();
