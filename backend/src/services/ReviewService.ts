import Review, { IReview } from '../models/Review';
import Place from '../models/Place';
import { CreateReviewDTO } from '../types';
import { AppError } from '../middleware/error';
import mongoose from 'mongoose';

export class ReviewService {
  async createReview(data: CreateReviewDTO, userId: string): Promise<IReview> {
    const review = await Review.create({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
      placeId: new mongoose.Types.ObjectId(data.placeId),
    });

    await this.updatePlaceRating(data.placeId);
    return review;
  }

  async getReviewsByPlace(placeId: string): Promise<IReview[]> {
    return Review.find({ placeId }).populate('userId', 'name avatar').sort('-createdAt');
  }

  async voteHelpful(reviewId: string, userId: string): Promise<IReview> {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError('Review not found', 404);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const voteIndex = review.votedBy.indexOf(userObjectId);

    if (voteIndex === -1) {
      review.votedBy.push(userObjectId);
      review.helpfulVotes += 1;
    } else {
      review.votedBy.splice(voteIndex, 1);
      review.helpfulVotes -= 1;
    }

    await review.save();
    return review;
  }

  private async updatePlaceRating(placeId: string): Promise<void> {
    const stats = await Review.aggregate([
      { $match: { placeId: new mongoose.Types.ObjectId(placeId) } },
      {
        $group: {
          _id: '$placeId',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Place.findByIdAndUpdate(placeId, {
        averageRating: Math.round(stats[0].avgRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
      });
    }
  }
}
