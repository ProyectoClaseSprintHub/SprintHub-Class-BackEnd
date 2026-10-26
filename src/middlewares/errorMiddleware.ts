import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import ValidationError from "../errors/ValidationError";
import DatabaseError from "../errors/DatabaseError";

export const errorMiddleware = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            message: 'Datos Invalidos',
            errors: error.message
        });
        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            message: error.message
        });
        return;
    }

    if (error instanceof ValidationError) {
        res.status(400).json({
            message: error.message
        });
        return;
    }

    if (error instanceof DatabaseError) {
        res.status(500).json({
            message: error.message
        });
        return;
    }

    console.error(error);
    res.sendStatus(500).json({
        message: 'Error interno del servidor'
    });
};