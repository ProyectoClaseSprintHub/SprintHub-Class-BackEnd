import { Server } from 'socket.io';
import { AuthSocket } from '../socketAuthMiddleware';
import { services } from '../../dependencies/serviceDependency';
import { mongoIdSchema } from '../../utils/idValidator';

const boardService = services.board;

export function registerBoardHandlers(io: Server, socket: AuthSocket){

    socket.on('board:join', async(boardId: string, callback) => {
        
        try{

			const boardIdParsed = mongoIdSchema.parse(boardId);

            const board = await boardService.findBoardById(boardIdParsed, socket.data.userId);

			socket.join(`board:${boardIdParsed}`);
			callback?.({ok: true, board});

		}catch(err: any){
			callback?.({ok: false, error: err.message });
		}

    });

	socket.on('board:leave', (boardIdParsed: string) => {
		socket.leave(`board:${boardIdParsed}`);
	});

}
