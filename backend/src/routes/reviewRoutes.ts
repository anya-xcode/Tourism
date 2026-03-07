import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { auth } from '../middleware/auth';

const router = Router();
const controller = new ReviewController();

router.get('/place/:placeId', controller.getPlaceReviews);
router.post('/', auth, controller.createReview);
router.post('/:id/helpful', auth, controller.voteHelpful);

export default router;
