import { IBoard } from '../models/Board';
import {CardModel, ICard} from '../models/Card';
import { IColumn } from '../models/Colum';
import { CardWithDetails } from '../dtos/response/cardResponseDto';
import mongoose from 'mongoose';
import DatabaseError from '../errors/DatabaseError';
import { CreateCardDatabase, UpdateCardDatabase } from '../dtos/input/cardInputDto';

type CardWithGroup = {
  columnId: Omit<IColumn, 'boardId'> & {
   boardId: IBoard };
};

export class CardRepository{

  async findById(id: string):Promise<CardWithDetails | null>{

    try{

      const [card] = await CardModel.aggregate([

        {$match: {_id: new mongoose.Types.ObjectId(id)}},

        {
          $lookup:{
            from: 'users',
            localField: 'assignedTo',
            foreignField: '_id',
            as: 'assignedTo'
          }
        },
        {$unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true }},

        {
          $project: {
            _id: 1,
            columnId: 1,
            title: 1,
            description: 1,
            dueDate: 1,
            priority: 1,
            createdAt: 1,
            updatedAt: 1,
            assignedTo:{
              _id: '$assignedTo._id',
              name: '$assignedTo.name',
              email: '$assignedTo.email',
              profilePicture: '$assignedTo.profilePicture'
            }
          }
        }

      ]);

      return card || null;
    }catch(error: unknown){
      throw new DatabaseError('Error en la busqueda de la tarjeta');
    }

  }

  async create(data: CreateCardDatabase ): Promise<CardWithDetails>{

      const newCard = await CardModel.create(data);

      const cardPopulate = await this.findById(newCard._id.toString());
      if(!cardPopulate){
        throw new DatabaseError('Error al crear la tarjeta.');
      }

      return cardPopulate;

  }

  async update(idActualizar: string, data: UpdateCardDatabase ):Promise<CardWithDetails | null>{

      const updateCard = await CardModel.findByIdAndUpdate(idActualizar,data,{
          returnDocument: 'after',
          runValidators: true
      }).exec();
      if(!updateCard){
        throw new DatabaseError('Error al actualizar la tarjeta.');
      }

      return this.findById(updateCard._id.toString());

  }

  async delete(idEliminar: string): Promise<boolean>{
      
      const resultado = await CardModel.findByIdAndDelete(idEliminar).exec();
      return resultado !== null;
      
  }

  async getCardContext(id: string): Promise<{ groupId: string; boardId: string; } | null> {
          
    const resultado = await CardModel.findById(id)
    .populate<CardWithGroup>({
      path: 'columnId',
      select: 'boardId',
      populate:{
      path: 'boardId',
      select: 'groupId _id'
      }
    }).lean().exec();

    if(!resultado?.columnId?.boardId){
        return null;
    }

    const groupId = resultado?.columnId?.boardId.groupId.toString();
    const boardId = resultado?.columnId?.boardId._id.toString();

    return {groupId, boardId};
  }

  async unassignUserFromAllCards(userId: string): Promise<boolean> {
    const result = await CardModel.updateMany(
      { assignedTo: userId },
      { $set: { assignedTo: null } }
    ).exec();

    return result.modifiedCount > 0;
  }

}