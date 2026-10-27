import { services as s} from './serviceDependency';
import { UserController } from "../controllers/userController";
import { GroupController } from "../controllers/groupController";
import { AuthController } from "../controllers/authController";
import { BoardController } from '../controllers/boardController';

export const controllers= {
    board: new BoardController(s.board),
    auth: new AuthController(s.auth),
    user: new UserController(s.user),
    group: new GroupController(s.group)

};
