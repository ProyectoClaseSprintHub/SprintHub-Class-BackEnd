import { services as s } from './servicesDependency';
import { BoardController } from '../controllers/boardController';
import { UserController } from '../controllers/userController';
import { GroupController } from '../controllers/groupContoller';
import { AuthController } from '../controllers/authController';

export const controllers = {
    board: new BoardController(s.board),
    auth: new AuthController(s.auth),
    user: new UserController(s.user),
    group: new GroupController(s.group)
};

