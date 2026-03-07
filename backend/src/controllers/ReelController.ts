import { Response } from 'express';
import { AuthRequest } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';
import { AppError } from '../middleware/error';

export class ReelController {
  private reelService = ServiceFactory.getInstance().getReelService();

  uploadReel = async (req: AuthRequest, res: Response) => {
    if (!req.file) throw new AppError('No video file uploaded', 400);

    const reel = await this.reelService.uploadReel(
      req.file,
      req.user!.id,
      req.body.placeId,
      req.body.caption
    );
    res.status(201).json(reel);
  };

  getFeed = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const reels = await this.reelService.getReelsFeed(page);
    res.status(200).json(reels);
  };

  toggleLike = async (req: AuthRequest, res: Response) => {
    const result = await this.reelService.toggleLike(req.params.id, req.user!.id);
    res.status(200).json(result);
  };

  incrementView = async (req: AuthRequest, res: Response) => {
    await this.reelService.incrementViews(req.params.id);
    res.status(204).send();
  };
}
