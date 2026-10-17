import mongoose, { Schema, InferSchemaType } from 'mongoose';
import { CardModel } from './Card';

const ColumnSchema = new Schema(
  {
    name:{ type: String, required:true},
    boardId:{type: Schema.Types.ObjectId, ref: 'Board', required: true}
  },
  {timestamps: true,
    versionKey: false
  }
);

ColumnSchema.pre('findOneAndDelete', async function(){
  const columnId = this.getQuery()._id;
  const cards = await CardModel.find({columnId}).select('_id');

  for(const card of cards){
    await CardModel.findByIdAndDelete(card._id);
  }
});


export type IColumn = InferSchemaType<typeof ColumnSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const ColumnModel = mongoose.model<IColumn>('Column', ColumnSchema);