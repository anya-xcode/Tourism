import { BaseService } from './BaseService';
import type { IMedia } from '../types';

/**
 * MediaService — OOP class for Media Upload API.
 * Handles photo/video uploads and retrieval via Cloudinary.
 */
class MediaServiceClass extends BaseService {
  constructor() {
    super('/media');
  }

  public async getByPlace(placeId: string): Promise<IMedia[]> {
    return this.get<IMedia[]>(`/place/${placeId}`);
  }

  public async upload(file: File, placeId: string, type: 'photo' | 'video', caption?: string): Promise<IMedia> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('placeId', placeId);
    formData.append('type', type);
    if (caption) formData.append('caption', caption);

    return this.post<IMedia>('', formData);
  }

  public async deleteMedia(mediaId: string): Promise<void> {
    return this.delete(`/${mediaId}`);
  }
}

/** Singleton instance */
export const MediaService = new MediaServiceClass();
