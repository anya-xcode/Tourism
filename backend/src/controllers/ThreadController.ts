import { Response } from 'express';
import { AuthRequest } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class ThreadController {
  private threadService = ServiceFactory.getInstance().getThreadService();

  createThread = async (req: AuthRequest, res: Response) => {
    const thread = await this.threadService.createThread(req.body, req.user!.id);
    res.status(201).json(thread);
  };

  createReply = async (req: AuthRequest, res: Response) => {
    const reply = await this.threadService.createReply(req.body, req.user!.id);
    res.status(201).json(reply);
  };

  getPlaceThreads = async (req: AuthRequest, res: Response) => {
    const threads = await this.threadService.getThreadsByPlace(req.params.placeId);
    res.status(200).json(threads);
  };
}
