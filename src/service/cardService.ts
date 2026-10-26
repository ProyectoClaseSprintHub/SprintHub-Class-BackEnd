import { CardDetailsResponse } from '../dtos/response/cardResponseDto';
import { CreateCardInput, UpdateCardInput } from '../dtos/input/cardInputDto';
import { ColumnRepository } from '../repository/columnRepository';
import { GroupRepository } from '../repository/groupRepository';
import { CardRepository } from '../repository/cardRepository';
import { UserRepository} from '../repository/userRepository';
import ValidationError from '../errors/ValidationError';
import { CardMapper } from '../mappers/cardMapper';



export class CardService{

    constructor(
        private readonly cardRepository: CardRepository,
        private readonly columnRepository: ColumnRepository,
        private readonly userRepository: UserRepository,
        private readonly groupRepository: GroupRepository,
    ){}

    async create(data: CreateCardInput, userId: string): Promise<{card: CardDetailsResponse, boardId: string}>{

        const columnContext = await this.columnRepository.getColumnContext(data.columnId);
        if(!columnContext){
            throw new ValidationError('la columna relacionada no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        columnContext.groupId,
        userId,
        ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        try{

        const card = await this.cardRepository.create({
            title: data.title,
            description: data.description,
            columnId: data.columnId,
            assignedTo: data.assignedTo,
            priority: data.priority
        }); 

        return {card: CardMapper.toDetailsResponse(card), boardId: columnContext.boardId}

        }catch(error: unknown){

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new ValidationError(`No se ha podido crear la tarjeta ${errorMessage}`);

        }

    }

    async update(data: UpdateCardInput, userId: string): Promise<{card: CardDetailsResponse, boardId: string}>{

        const cardContext = await this.cardRepository.getCardContext(data.cardId);
        if(!cardContext){
            throw new ValidationError('La card que se intenta actualizar no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        cardContext.groupId,
        userId,
        ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        if (data.assignedTo) {
        const asignedToExist = await this.userRepository.existById(data.assignedTo);
        if(!asignedToExist){
                throw new ValidationError('El usuario asignado no existe');
        }
        }

        if (data.columnId) {
            const columnExist = await this.columnRepository.existById(data.columnId);
            if(!columnExist){
                throw new ValidationError('La columna relacionada no existe');
            }
        }
        
        const card = await this.cardRepository.update(data.cardId, {
            description: data.description,
            title: data.title,
            columnId: data.columnId,
            assignedTo: data.assignedTo,
            priority: data.priority,
        });

        if(!card){
            throw new ValidationError('No se ha podido actualizar la card.')
        }

        return{card: CardMapper.toDetailsResponse(card), boardId: cardContext.boardId};
    }

    async delete(id: string, userId: string): Promise<string>{

        const cardContext = await this.cardRepository.getCardContext(id);
        if(!cardContext){
            throw new ValidationError('La card que se intenta eliminar no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        cardContext.groupId,
        userId,
        ['admin'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        const eliminado = await this.cardRepository.delete(id);

        if(!eliminado){
            throw new ValidationError('La tarjeta que se intenta elminar no existe');
        }

        return cardContext.boardId;

    }
}
