import { Request, Response, NextFunction } from "express";
import { BoardService } from "../service/boardService";
import { mongoIdSchema } from "../utils/idValidator";
import { createBoardInputSchema, updateBoardInputSchema } from "../dtos/input/boardInputDto";

export class BoardController{
  constructor(private boardService: BoardService){}

  async findByGroupId(req: Request, res:Response, next: NextFunction){
    try{
      const userId = req.user.userId;
      const groupId = mongoIdSchema.parse(req.params.groupId);

      const boards = await this.boardService.findByGroupId(userId,groupId);

      return res.status(200).json(boards);

    }catch(error){
      next(error);
    }
  }

 async update(req: Request, res: Response, next: NextFunction){
    try{
      const userId = req.user.userId;
      const boardId = mongoIdSchema.parse(req.params.id)

      const data = updateBoardInputSchema.parse({...req.body, id:boardId});

      const board = await this.boardService.update(data,userId);
      return res.status(200).json({
        message: 'Tablero actualizado correctamente',
        data: board
      });

    }catch(error){
      next(error);
    }

  }

  async create(req: Request, res: Response, next: NextFunction){
    try{
      const userId = req.user.userId;
      const data = createBoardInputSchema.parse({...req.body});

      const board = await this.boardService.create(data,userId);
      return res.status(201).json({
        message: 'Tablero creado correctamente',
        data: board,
      });

    }catch(error){
      next(error);
    }

  }
  async delete(req: Request, res: Response, next: NextFunction){
    try{
      const userId = req.user.userId;
      const boardId = mongoIdSchema.parse(req.params.id)

      await this.boardService.delete(boardId,userId);

      return res.status(200).json({
        message: 'Tablero eliminado correctamente',
      })

    }catch(error){
      next(error);
    }
  }

}