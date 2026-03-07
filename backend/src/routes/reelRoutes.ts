import { Router } from 'express';
import { ReelController } from '../controllers/ReelController';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new ReelController();

router.get('/feed', controller.getFeed);
router.post('/', auth, upload.single('video'), controller.uploadReel);
router.post('/:id/like', auth, controller.toggleLike);
router.post('/:id/view', controller.incrementView);

export default router;
