import mongoose from 'mongoose';
import { IBoard } from '../models/Board';
import { ColumnModel, IColumn } from '../models/Column';
import { ColumnWithDetails } from '../dtos/response/columnResponseDto';
import DatabaseError from '../errors/DatabaseError';
import { CreateColumnDatabase, UpdateColumnDatabase } from '../dtos/input/columnInputDto';

type ColumnWithGroup = {
  boardId: IBoard
}

export class ColumnRepository {

  async findById(id: string): Promise<ColumnWithDetails | null> {

      try {

      const [columnDetails] = await ColumnModel.aggregate([

        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },

        {
          $lookup: {
            from: 'cards',
            localField: '_id',
            foreignField: 'columnId',
            pipeline: [
              {
                $lookup: {
                  from: 'users',
                  localField: 'assignedTo',
                  foreignField: '_id',
                  as: 'assignedTo'
                }
              },
              { $unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true } },

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
                  assignedTo: {
                    _id: '$assignedTo._id',
                    name: '$assignedTo.name',
                    email: '$assignedTo.email',
                    profilePicture: '$assignedTo.profilePicture'
                  }
                }
              }
            ],
            as: 'cards'
          }
        },

        {
          $project: {
            _id: 1,
            name: 1,
            boardId: 1,
            createdAt: 1,
            updatedAt: 1,
            cards: 1
          }
        }

      ]);

      return columnDetails || null;

    } catch (error: unknown) {
      throw new DatabaseError('Error en la busqueda de la columna');
    }

  }

  async create(data: CreateColumnDatabase): Promise<ColumnWithDetails> {
    
    const newColumn = await ColumnModel.create(data);
    const columnPopulate = await this.findById(newColumn._id.toString());
    if(!columnPopulate){
      throw new DatabaseError('Error al crear la columna.')
    }

    return columnPopulate;
  
  }

  async update(idActualizar: string, data: UpdateColumnDatabase): Promise<ColumnWithDetails | null> {

    const updateColumn = await ColumnModel.findByIdAndUpdate(idActualizar, data, {
      returnDocument: 'after',
      runValidators: true,
    }).exec();
    if(!updateColumn){
      throw new DatabaseError('Error al actualizar la columna.');
    }

    return this.findById(updateColumn._id.toString());

  }

  async delete(idEliminar: string): Promise<boolean> {
    
    const resultado = await ColumnModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  
  }

  async existById(id: string): Promise<boolean>{

    const existe = await ColumnModel.exists({_id: id}).exec();
    return existe !== null;

  }

  async getColumnContext(id: string): Promise<{ groupId: string; boardId: string; } | null> {
    
    const resultado = await ColumnModel.findById(id)
    .populate<ColumnWithGroup>({
      path: 'boardId',
      select: 'groupId _id'
    }).lean().exec();

    if (!resultado?.boardId) {
        return null;
    }

    const groupId = resultado?.boardId?.groupId.toString();
    const boardId = resultado?.boardId?._id.toString();

    return {groupId, boardId};
  } 

}
