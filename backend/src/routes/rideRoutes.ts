import { Router } from 'express';
import { RideController } from '../controllers/RideController';
import { auth } from '../middleware/auth';

const router = Router();
const controller = new RideController();

router.post('/compare', auth, controller.compareFares);

export default router;
