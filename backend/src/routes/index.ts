import { Router } from 'express';
import authRoutes from './authRoutes';
import placeRoutes from './placeRoutes';
import reviewRoutes from './reviewRoutes';
import mediaRoutes from './mediaRoutes';
import reelRoutes from './reelRoutes';
import rideRoutes from './rideRoutes';
import visitRoutes from './visitRoutes';
import threadRoutes from './threadRoutes';
import aiRoutes from './aiRoutes';
import bookmarkRoutes from './bookmarkRoutes';
import adminRoutes from './adminRoutes';
import navigationRoutes from './navigationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/places', placeRoutes);
router.use('/reviews', reviewRoutes);
router.use('/media', mediaRoutes);
router.use('/uploads', reelRoutes);
router.use('/rides', rideRoutes);
router.use('/visits', visitRoutes);
router.use('/threads', threadRoutes);
router.use('/ai', aiRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/admin', adminRoutes);
router.use('/navigation', navigationRoutes);

export default router;
