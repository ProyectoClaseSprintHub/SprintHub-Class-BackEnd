import { BoardDetailsResponse, BoardResponse } from '../dtos/response/boardResponseDto';
import { CreateBoardInput, UpdateBoardInput } from '../dtos/input/boardInputDto';
import { ColumnRepository } from '../repository/columnRepository';
import { BoardRepository} from '../repository/boardRepository';
import { GroupRepository } from '../repository/groupRepository';
import ValidationError from '../errors/ValidationError';
import { BoardMapper } from '../mappers/boardMapper';
import AppError from '../errors/AppError';


export class BoardService{

    constructor(
        private readonly boardRepository: BoardRepository,
        private readonly groupRepository: GroupRepository,
        private readonly columnRepository: ColumnRepository
    ){}

    async findByGroupId(groupId: string, userId: string): Promise<BoardResponse[]>{

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }

        const boards = await this.boardRepository.findByGroupId(groupId);
        
        return boards.map(board => BoardMapper.toResponse(board));

    }

    async findBoardById(boardId: string, userId: string): Promise<BoardDetailsResponse> {

        const groupId = await this.boardRepository.getGroupIdByBoardId(boardId);
        if(!groupId){
            throw new ValidationError('El tablero que se intenta obtener no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción o el grupo no existe');
        }

        const board = await this.boardRepository.findById(boardId);
        if(!board){
            throw new ValidationError('El tablero que se intenta obtener no existe');
        }

        return BoardMapper.toDetailsResponse(board);
    }

    async create(data: CreateBoardInput, userId: string): Promise<BoardDetailsResponse>{

        const hasPermission  = await this.groupRepository.isMemberAndRoleValid(
          data.groupId,
          userId,
          ['admin', 'collaborator']
        );

         if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo u usuario no existen', 403);
        }

        try{

            const newBoard = await this.boardRepository.create({
                title: data.title,
                description: data.description,
                groupId: data.groupId,
            });

            const boardIdStr = newBoard._id.toString();
            
            const defaultColumns = [
                { name: 'Por hacer', boardId: boardIdStr },
                { name: 'En proceso', boardId: boardIdStr },
                { name: 'Hecho', boardId: boardIdStr }
            ];

            await Promise.all(defaultColumns.map(col => this.columnRepository.create(col)));
            
            return BoardMapper.toDetailsResponse(newBoard);
            
        }catch(error: unknown){

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new AppError(`No se ha podido crear el tablero ${errorMessage}`, 500);

        }

    }

    async update(data: UpdateBoardInput, userId: string): Promise<BoardDetailsResponse>{

        const groupId = await this.boardRepository.getGroupIdByBoardId(data.id);
        if(!groupId){
            throw new AppError('El tablero que se intenta actualizar no existe', 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción', 403);
        }

        const board = await this.boardRepository.update(data.id,
            {title: data.title,
            description: data.description
        });

        if(!board){
            throw new AppError('El tablero no se ha podido actualizar.', 500);
        }

        return BoardMapper.toDetailsResponse(board);
    }

    async delete(id: string, userId: string): Promise<void>{

        const groupId = await this.boardRepository.getGroupIdByBoardId(id);
        if(!groupId){
            throw new AppError('El tablero que se intenta eliminar no existe', 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ['admin'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción', 403);
        }

        const eliminado = await this.boardRepository.delete(id);

        if(!eliminado){
            throw new AppError('El tablero que se intenta eliminar no existe', 404);
        }

    }
    
}
