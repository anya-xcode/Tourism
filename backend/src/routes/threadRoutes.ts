import { Router } from 'express';
import { ThreadController } from '../controllers/ThreadController';
import { auth } from '../middleware/auth';

const router = Router();
const controller = new ThreadController();

router.get('/place/:placeId', controller.getPlaceThreads);
router.post('/', auth, controller.createThread);
router.post('/reply', auth, controller.createReply);

export default router;
