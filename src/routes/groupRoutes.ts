import { Router } from 'express';
import { controllers } from '../dependencies/controllerDependency'; 
import { requireAuth } from '../middlewares/authMiddleware';
import { uploadToCloudinary } from '../middlewares/uploadMiddleware';


const groupController = controllers.group;

const router = Router();

router.use(requireAuth);

router.post('/', uploadToCloudinary.single('file'),groupController.createGroup.bind(groupController));
router.put('/:id', uploadToCloudinary.single('file'), groupController.updateGroup.bind(groupController));
router.delete('/:id', groupController.deleteGroup.bind(groupController));
router.get('/', groupController.getMyGroups.bind(groupController));
router.get('/:id', groupController.getGroupById.bind(groupController));
router.post('/:groupId/members', groupController.addMember.bind(groupController));
router.put('/:id/members/:userId', groupController.updateMemberRole.bind(groupController));
router.delete('/:id/members/:userId', groupController.removeMember.bind(groupController));

export default router;