import { BoardRepository } from '../repository/boardRepository';
import { CardRepository } from '../repository/cardRepository';
import { ColumnRepository } from '../repository/columnRepository';
import { GroupRepository } from '../repository/groupRepository';
import { UserRepository } from '../repository/userRepository';

export const repositories = {
    user: new UserRepository(),
    group: new GroupRepository(),
    board: new BoardRepository(),
    column: new ColumnRepository(),
    card: new CardRepository()
}
