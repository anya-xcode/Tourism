import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { auth, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();
const controller = new AdminController();

router.post('/report', auth, controller.reportContent);
router.get('/flags', auth, authorize(UserRole.ADMIN), controller.getPendingFlags);
router.put('/flags/:id/resolve', auth, authorize(UserRole.ADMIN), controller.resolveFlag);

export default router;
