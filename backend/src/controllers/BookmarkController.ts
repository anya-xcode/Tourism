import { Response } from 'express';
import { AuthRequest, BookmarkType } from '../types';
import ServiceFactory from '../patterns/ServiceFactory';

export class BookmarkController {
  private bookmarkService = ServiceFactory.getInstance().getBookmarkService();

  toggleBookmark = async (req: AuthRequest, res: Response) => {
    const { targetId, type } = req.body;
    const result = await this.bookmarkService.toggleBookmark(req.user!.id, targetId, type as BookmarkType);
    res.status(200).json(result);
  };

  getBookmarks = async (req: AuthRequest, res: Response) => {
    const type = req.query.type as BookmarkType;
    const bookmarks = await this.bookmarkService.getBookmarks(req.user!.id, type);
    res.status(200).json(bookmarks);
  };
}
