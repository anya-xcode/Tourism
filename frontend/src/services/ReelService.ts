import { BaseService } from './BaseService';
import type { IReel } from '../types';

/**
 * ReelService — OOP class for Reels/Experience Video API.
 * Handles feed fetching, likes, views, and uploads.
 */
class ReelServiceClass extends BaseService {
  constructor() {
    super('/uploads');
  }

  public async getFeed(page: number = 1): Promise<IReel[]> {
    return this.get<IReel[]>('/feed', { page });
  }

  public async toggleLike(reelId: string): Promise<{ liked: boolean; likes: number }> {
    return this.post<{ liked: boolean; likes: number }>(`/${reelId}/like`);
  }

  public async incrementView(reelId: string): Promise<void> {
    return this.post(`/${reelId}/view`);
  }

  public async upload(file: File, placeId: string, caption: string): Promise<IReel> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('placeId', placeId);
    formData.append('caption', caption);

    return this.post<IReel>('', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

/** Singleton instance */
export const ReelService = new ReelServiceClass();
