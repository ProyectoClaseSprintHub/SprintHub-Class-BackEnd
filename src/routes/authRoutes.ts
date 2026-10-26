import { Router } from 'express';
import { controllers } from '../dependencies/controllerDependency';
import { uploadToCloudinary } from '../middlewares/uploadMiddleware';

const authController = controllers.auth;

const router = Router();

router.post('/login', authController.login.bind(authController));
router.post('/register', uploadToCloudinary.single('file'), authController.register.bind(authController));

export default router;