import { Router } from 'express';
import { VisitController } from '../controllers/VisitController';
import { auth } from '../middleware/auth';

const router = Router();
const controller = new VisitController();

router.get('/upcoming', controller.getUpcoming);
router.post('/', auth, controller.createEvent);
router.post('/:id/rsvp', auth, controller.rsvp);
router.get('/:id/participants', controller.getParticipants);

export default router;
