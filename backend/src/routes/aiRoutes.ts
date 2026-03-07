import { Router } from 'express';
import { AIServiceController } from '../controllers/AIController';
import { auth } from '../middleware/auth';

const router = Router();
const controller = new AIServiceController();

router.get('/recommendations', auth, controller.getRecommendations);
router.post('/check-duplicate', auth, controller.checkDuplicate);

export default router;
