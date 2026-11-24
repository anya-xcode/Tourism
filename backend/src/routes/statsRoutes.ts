import { Router } from 'express';
import { StatsController } from '../controllers/StatsController';
import { auth } from '../middleware/auth';

const router = Router();
const controller = new StatsController();

router.get('/', controller.getCommunityStats);
router.get('/me', auth, controller.getMyStats);

export default router;
