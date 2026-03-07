import { Router } from 'express';
import { BookmarkController } from '../controllers/BookmarkController';
import { auth } from '../middleware/auth';

const router = Router();
const controller = new BookmarkController();

router.get('/', auth, controller.getBookmarks);
router.post('/toggle', auth, controller.toggleBookmark);

export default router;
