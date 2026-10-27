import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { controllers } from "../dependencies/ControllerDependency";

const boardController = controllers.board;
const router = Router();

router.use(requireAuth);

router.get('/group/:groupId', boardController.findByGroupId.bind(boardController));
router.post('/', boardController.create.bind(boardController));
router.put('/:id',boardController.update.bind(boardController));
router.delete('/:id', boardController.delete.bind(boardController));

export default router;