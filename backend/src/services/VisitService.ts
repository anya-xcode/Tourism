import VisitEvent, { IVisitEvent } from '../models/VisitEvent';
import VisitRSVP, { IVisitRSVP } from '../models/VisitRSVP';
import { CreateEventDTO, RSVPStatus } from '../types';
import { AppError } from '../middleware/error';
import mongoose from 'mongoose';

export class VisitService {
  async createEvent(data: CreateEventDTO, userId: string): Promise<IVisitEvent> {
    return VisitEvent.create({
      ...data,
      creatorId: new mongoose.Types.ObjectId(userId),
      placeId: new mongoose.Types.ObjectId(data.placeId),
    });
  }

  async getUpcomingEvents(placeId?: string): Promise<any[]> {
    const query: any = { scheduledDate: { $gte: new Date() } };
    if (placeId) query.placeId = new mongoose.Types.ObjectId(placeId);

    const events = await VisitEvent.find(query)
      .populate('placeId', 'name city')
      .populate('creatorId', 'name avatar')
      .sort('scheduledDate');

    // Attach participation counts
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const count = await VisitRSVP.countDocuments({
          eventId: event._id,
          status: RSVPStatus.GOING,
        });
        return { ...event.toObject(), currentParticipants: count };
      })
    );

    return enrichedEvents;
  }

  async rsvpToEvent(eventId: string, userId: string, status: RSVPStatus): Promise<IVisitRSVP> {
    const event = await VisitEvent.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    if (status === RSVPStatus.GOING) {
      const count = await VisitRSVP.countDocuments({ eventId, status: RSVPStatus.GOING });
      if (count >= event.maxParticipants) {
        throw new AppError('Event is full', 400);
      }
    }

    const rsvp = await VisitRSVP.findOneAndUpdate(
      { eventId, userId: new mongoose.Types.ObjectId(userId) },
      { status, respondedAt: new Date() },
      { upsert: true, new: true }
    );

    return rsvp;
  }

  async getParticipants(eventId: string): Promise<any[]> {
    return VisitRSVP.find({ eventId }).populate('userId', 'name avatar');
  }
}
