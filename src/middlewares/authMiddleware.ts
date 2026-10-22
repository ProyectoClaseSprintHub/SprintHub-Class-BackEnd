import { Request , Response, NextFunction } from "express"; 
import jwt from "jsonwebtoken";
import env from "../config/env";
import AppError from "../errors/AppError";

interface JwtPayLoad {
    userId: string;
}

export const requireAuth = (
    req: Request,
    res: Response, 
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            throw new AppError('Token no proporcionado', 401);
        }

        const [type, token] = authHeader.split('');
        if(type !== 'Bearer' || !token){
            throw new AppError('El formato de Token invalido', 401);
        }

        const decoded = jwt.verify(token, env.jwtsecret) as JwtPayLoad;
        req.user = {
            userId: decoded.userId,
        };

        next();

    } catch (error) {
        next(error);
    }
}
