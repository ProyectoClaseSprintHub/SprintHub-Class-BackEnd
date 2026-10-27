import { Server } from "socket.io";
import { mongoIdSchema } from "../utils/idValidator";
import { AuthSocket } from "./socketAuthMiddleware";
import { services } from "../dependencies/serviceDependency";

const boardService = services.board;

export function registerBoardHandlers(io: Server, socket: AuthSocket) {

    socket.on("board:join", async(boardId: string, callback) =>{

        try {
            const boardIdParsed = mongoIdSchema.parse(boardId);
            const board = await boardService.findBoardById(boardIdParsed, socket.data.userId);

            socket.join(`board:${boardIdParsed}`);
            callback?.({ok: true, board});

        }catch (err: any) {
            callback?.({ok: false, error: err.message});
        }
   });

   socket.on("board:leave", async(boardId: string) => {
    socket.leave(`board:${boardId}`);
   });
}