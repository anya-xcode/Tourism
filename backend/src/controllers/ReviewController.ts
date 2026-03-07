import { Response } from 'express';
import { AuthRequest } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class ReviewController {
  private reviewService = ServiceFactory.getInstance().getReviewService();

  createReview = async (req: AuthRequest, res: Response) => {
    const review = await this.reviewService.createReview(req.body, req.user!.id);
    res.status(201).json(review);
  };

  getPlaceReviews = async (req: AuthRequest, res: Response) => {
    const reviews = await this.reviewService.getReviewsByPlace(req.params.placeId);
    res.status(200).json(reviews);
  };

  voteHelpful = async (req: AuthRequest, res: Response) => {
    const review = await this.reviewService.voteHelpful(req.params.id, req.user!.id);
    res.status(200).json(review);
  };
}
