import { BaseService } from './BaseService';

/**
 * BookmarkService — OOP class for Bookmark API.
 * Handles toggling bookmarks and fetching user bookmarks.
 */
class BookmarkServiceClass extends BaseService {
  constructor() {
    super('/bookmarks');
  }

  public async toggle(targetId: string, type: 'place' | 'reel'): Promise<{ bookmarked: boolean }> {
    return this.post<{ bookmarked: boolean }>('/toggle', { targetId, type });
  }

  public async getAll(type?: 'place' | 'reel'): Promise<any[]> {
    const params = type ? { type } : undefined;
    return this.get<any[]>('', params);
  }
}

/** Singleton instance */
export const BookmarkService = new BookmarkServiceClass();
