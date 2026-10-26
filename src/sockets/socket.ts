import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import env from "../config/env";
import { socketAuthMiddleware, AuthSocket } from './socketAuthMiddleware';
import { registerColumnHandlers } from "./handlers/columnSockets";
import { registerBoardHandlers } from "./handlers/boardSocket";
import { registerCardHandlers } from "./handlers/cardSocket";

let ioInstance: SocketServer;

export function configureSockets(httpServer: HttpServer) {

    const io = new SocketServer(httpServer, {
        cors: {
            origin: env.corsOrigin,
            methods: ["GET", "POST"]
        }
    });

    io.use(socketAuthMiddleware);

    io.on("connection", (socket: AuthSocket) => {
        console.log(`[Socket] Usuario ${socket.data.userId} conectado (${socket.id})`);

        registerBoardHandlers(io, socket);
        registerColumnHandlers(io, socket);
        registerCardHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log(`[Socket] Usuario ${socket.data.userId} desconectado`);
        });
    });

    ioInstance = io;
    return io;
}

export function getIo(): SocketServer {
    if (!ioInstance) {
        throw new Error("Socket.io no ah sido inicializado.");
    }

    return ioInstance;
}