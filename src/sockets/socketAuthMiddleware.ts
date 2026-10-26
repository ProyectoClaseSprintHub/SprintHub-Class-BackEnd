import {Socket} from 'socket.io';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import ValidationError from '../errors/ValidationError';
import { JwtPayload } from '../utils/JwtPayload';

export interface AuthSocket extends Socket{
    data:{
        userId: string;
    }
}

export function socketAuthMiddleware(socket: Socket, next:(err?: Error) => void){

	const token = socket.handshake.auth?.token as string | undefined;
	if(!token){

		return next(new ValidationError('No se proporciono token de autentificacion'));
	
	}

	try{

		const decoded = jwt.verify(token, env.jwtsecret) as JwtPayload
		socket.data.userId = decoded.userId;
		next();
	}catch(err){
		next(new ValidationError('Token inavlido para sesion de Sockets'));
	}

}
