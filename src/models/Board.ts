import mongoose, { Schema, InferSchemaType } from 'mongoose';
import {ColumnModel} from '../models/Column';
const BoardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  },
  { timestamps: true,
    versionKey: false
  }
);

BoardSchema.pre('findOneAndDelete', async function() {
  
  const boardId = this.getQuery()._id;
  const columns = await ColumnModel.find({boardId}).select('_id');

  for(const column of columns){
    await ColumnModel.findByIdAndDelete(column._id);
  }

});

export type IBoard = InferSchemaType<typeof BoardSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const BoardModel = mongoose.model<IBoard>('Board', BoardSchema);
  