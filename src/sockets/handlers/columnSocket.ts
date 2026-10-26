import { Server } from 'socket.io';
import { AuthSocket } from '../socketAuthMiddleware';
import { services } from '../../dependencies/serviceDependency';
import { CreateColumnInput, createColumnInputSchema, DeleteColumnInput, deleteColumnInputSchema, UpdateColumnInput, updateColumnInputSchema } from '../../dtos/input/columnInputDto';

const columnService = services.column;


export function registerColumnsHandlers(io: Server, socket: AuthSocket){

    socket.on('column:create', async (data: CreateColumnInput, callback)=>{

    try{

        const columnData = createColumnInputSchema.parse(data);
        const column = await columnService.create(columnData, socket.data.userId);

        io.to(`board:${column.boardId}`).emit('column:created', column);
        callback?.({ok: true, column});

    }catch(err: any){
        callback?.({ok: false, error: err.message});
    }

    });

    socket.on('column:update', async (data: UpdateColumnInput, callback)=>{

        try{
        
            const columnData = updateColumnInputSchema.parse(data);

            const column = await columnService.update(columnData, socket.data.userId);
            socket.to(`board:${column.boardId}`).emit('column:updated', column);
            callback?.({ok: true, column});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('column:delete', async (data: DeleteColumnInput, callback) => {

        try{

            const columnId = deleteColumnInputSchema.parse(data);

            const boardId = await columnService.delete(columnId, socket.data.userId);
            io.to(`board:${boardId}`).emit('column:deleted', {columnId: columnId});
            callback?.({ok: true});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

}
