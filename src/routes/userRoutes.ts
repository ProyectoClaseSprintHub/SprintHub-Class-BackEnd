import { Router } from 'express';
import { controllers } from '../dependencies/controllerDependency';
import { requireAuth } from '../middlewares/authMiddleware';
import { uploadToCloudinary } from '../middlewares/uploadMiddleware';


const userController = controllers.user;
const router = Router();

router.use(requireAuth);


router.get('/me', userController.getInfoMe.bind(userController));
router.put('/:id', uploadToCloudinary.single('file'), userController.updateUser.bind(userController));
router.delete('/', userController.deleteUser.bind(userController));

export default router;