import { Server } from 'socket.io';
import { AuthSocket } from '../socketAuthMiddleware';
import { services } from '../../dependencies/serviceDependency';
import { CreateCardInput, createCardInputSchema, DeleteCardInput, deleteCardInputSchema, UpdateCardInput, updateCardInputSchema } from '../../dtos/input/cardInputDto';

const cardService = services.card;

export function registerCardHandlers(io: Server, socket: AuthSocket){

    socket.on('card:create', async (data: CreateCardInput, callback) =>{

        try{

            const cardData = createCardInputSchema.parse(data);

            const {card, boardId} = await cardService.create(cardData, socket.data.userId);
            io.to(`board:${boardId}`).emit('card:created', card);
            callback?.({ok: true, card});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('card:update', async(data: UpdateCardInput, callback) =>{

        try{

            const cardData = updateCardInputSchema.parse(data);

            const {card, boardId} = await cardService.update(cardData, socket.data.userId);
            socket.to(`board:${boardId}`).emit('card:updated', card);
            callback?.({ok: true, card});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('card:delete', async(data: DeleteCardInput, callback) => {

        try{

            const cardId =  deleteCardInputSchema.parse(data);

            const boardId = await cardService.delete(cardId, socket.data.userId);
            io.to(`board:${boardId}`).emit('card:deleted', cardId);
            callback?.({ok: true});
            
        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

}