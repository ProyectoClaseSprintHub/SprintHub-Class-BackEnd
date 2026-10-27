import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { controllers } from "../dependencies/ControllerDependency";
import { uploadToCloudinary } from "../middlewares/uploadMiddleware";

const userController = controllers.user;
const router = Router();

router.use(requireAuth);

router.get('/me', userController.getInfoMe.bind(userController));
router.put('/id', uploadToCloudinary.single('File'), userController.updateUser.bind(userController));
router.delete('/', userController.deleteUser.bind(userController));

export default router;