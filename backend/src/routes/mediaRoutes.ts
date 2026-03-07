import { Router } from 'express';
import { MediaController } from '../controllers/MediaController';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new MediaController();

router.get('/place/:placeId', controller.getPlaceMedia);
router.post('/', auth, upload.single('file'), controller.uploadMedia);
router.delete('/:id', auth, controller.deleteMedia);

export default router;
