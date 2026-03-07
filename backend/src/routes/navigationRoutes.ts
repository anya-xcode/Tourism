import { Router } from 'express';
import { NavigationController } from '../controllers/NavigationController';
import { auth } from '../middleware/auth';

const router = Router();
const controller = new NavigationController();

router.get('/distance', auth, controller.getDistance);

export default router;
