import { Response } from 'express';
import { AuthRequest, MediaType } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';
import { AppError } from '../middleware/error';

export class MediaController {
  private mediaService = ServiceFactory.getInstance().getMediaService();

  uploadMedia = async (req: AuthRequest, res: Response) => {
    if (!req.file) throw new AppError('No file uploaded', 400);

    const media = await this.mediaService.uploadMedia(
      req.file,
      req.user!.id,
      req.body.placeId,
      req.body.type as MediaType,
      req.body.caption
    );
    res.status(201).json(media);
  };

  getPlaceMedia = async (req: AuthRequest, res: Response) => {
    const media = await this.mediaService.getMediaByPlace(req.params.placeId);
    res.status(200).json(media);
  };

  deleteMedia = async (req: AuthRequest, res: Response) => {
    await this.mediaService.deleteMedia(req.params.id);
    res.status(204).send();
  };
}
