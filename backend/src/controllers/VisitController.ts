import { Response } from 'express';
import { AuthRequest } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class VisitController {
  private visitService = ServiceFactory.getInstance().getVisitService();

  createEvent = async (req: AuthRequest, res: Response) => {
    const event = await this.visitService.createEvent(req.body, req.user!.id);
    res.status(201).json(event);
  };

  getUpcoming = async (req: AuthRequest, res: Response) => {
    const placeId = req.query.placeId as string;
    const events = await this.visitService.getUpcomingEvents(placeId);
    res.status(200).json(events);
  };

  rsvp = async (req: AuthRequest, res: Response) => {
    const rsvp = await this.visitService.rsvpToEvent(req.params.id, req.user!.id, req.body.status);
    res.status(201).json(rsvp);
  };

  getParticipants = async (req: AuthRequest, res: Response) => {
    const participants = await this.visitService.getParticipants(req.params.id);
    res.status(200).json(participants);
  };
}
