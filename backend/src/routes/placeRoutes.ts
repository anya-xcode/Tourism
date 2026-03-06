import { Router } from 'express';
import { PlaceController } from '../controllers/PlaceController';
import { auth } from '../middleware/auth';

const router = Router();
const controller = new PlaceController();

router.get('/', controller.getPlaces);
router.get('/nearby', controller.getNearby);
router.get('/:id', controller.getPlaceById);
router.post('/', auth, controller.createPlace);

export default router;
