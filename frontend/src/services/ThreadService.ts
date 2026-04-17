import { BaseService } from './BaseService';
import type { IThread } from '../types';

/**
 * ThreadService — OOP class for Community Thread API.
 * Handles discussion threads and replies per place.
 */
class ThreadServiceClass extends BaseService {
  constructor() {
    super('/threads');
  }

  public async getByPlace(placeId: string): Promise<IThread[]> {
    return this.get<IThread[]>(`/place/${placeId}`);
  }

  public async createThread(data: { placeId: string; content: string }): Promise<IThread> {
    return this.post<IThread>('', data);
  }

  public async createReply(data: { threadId: string; content: string }): Promise<any> {
    return this.post('/reply', data);
  }
}

/** Singleton instance */
export const ThreadService = new ThreadServiceClass();
