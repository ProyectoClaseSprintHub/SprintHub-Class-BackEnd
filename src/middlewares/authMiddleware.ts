import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import AppError from '../errors/AppError';

interface JwtPayload {
  userId: string;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Token no proporcionado', 401);
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new AppError('Formato de token inválido', 401);
    }

    const decoded = jwt.verify(token, env.jwtsecret) as JwtPayload;

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    next(error);
  }
};
