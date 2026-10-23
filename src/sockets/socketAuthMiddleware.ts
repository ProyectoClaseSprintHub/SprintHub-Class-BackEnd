import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import env from "../config/env";
import ValidationError from "../errors/ValidationError";
import { JwtPayLoad } from "../utils/JwtPayLoad";

export interface AuthSocket extends Socket {
    data: {
        userId: string;
    }
}

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {

    const token = socket.handshake.auth?.token as string | undefined;
    
    if (!token){
        return next(new ValidationError('No se proporciono token de autenticación'));
    }

    try {
        const decoded = jwt.verify(token, env.jwtsecret) as JwtPayLoad
        socket.data.userId = decoded.userId;
        next();
    } catch (error) {
        next(new ValidationError('Token invalido para sesion de sockets.'))
    }
    


}