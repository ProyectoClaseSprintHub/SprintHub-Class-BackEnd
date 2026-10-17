import { repositories as r } from './repositoryDependency';
import { UserService } from '../service/userService';
import { GroupService } from '../service/groupService';
import { BoardService } from '../service/boardService';
import { ColumnService } from '../service/columnService';
import { CardService } from '../service/cardService';
import { AuthService } from '../service/authService';
import CloudinaryStorageService from '../service/storage/cloudinaryStorageService';

const cloudinary = new CloudinaryStorageService(); 

export const services = {
  cloudinary,
  user: new UserService(r.user,cloudinary),
  group: new GroupService(r.group, r.user, cloudinary),
  board: new BoardService(r.board, r.group, r.column),
  column: new ColumnService(r.column, r.board, r.group),
  card: new CardService(r.card, r.column, r.user, r.group),
  auth: new AuthService(r.user,cloudinary)
};
