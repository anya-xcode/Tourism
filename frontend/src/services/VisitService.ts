import { BaseService } from './BaseService';
import type { IVisitEvent } from '../types';

/**
 * VisitService — OOP class for Group Visit / Event Scheduling API.
 * Handles creating events, fetching upcoming events, and RSVPing.
 */
class VisitServiceClass extends BaseService {
  constructor() {
    super('/visits');
  }

  public async getUpcoming(placeId?: string): Promise<IVisitEvent[]> {
    const params = placeId ? { placeId } : undefined;
    return this.get<IVisitEvent[]>('/upcoming', params);
  }

  public async createEvent(data: {
    placeId: string;
    title: string;
    description: string;
    scheduledDate: string;
    time: string;
    maxParticipants: number;
    visibility: 'open' | 'invite-only';
  }): Promise<IVisitEvent> {
    return this.post<IVisitEvent>('', data);
  }

  public async rsvp(eventId: string, status: 'going' | 'maybe' | 'declined'): Promise<any> {
    return this.post(`/${eventId}/rsvp`, { status });
  }

  public async getParticipants(eventId: string): Promise<any[]> {
    return this.get<any[]>(`/${eventId}/participants`);
  }
}

/** Singleton instance */
export const VisitService = new VisitServiceClass();
