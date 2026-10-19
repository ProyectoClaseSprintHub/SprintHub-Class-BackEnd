import mongose, {Schema, InferSchemaType} from 'mongoose';
import {GroupModel} from './Group';
import path from 'node:path';

const UserSchema= new Schema(
    {
            name: {type:String, required: true },
            email: {type:String, required: true, unique:true },
            document: {type:String, required: true, unique:true },
            passwordHash:{type: String, requiered: true},
            profilePicture: { 
                path: {type:String},
                fileName: {type: String},
                url: {type: String}
            }
    },
    { timestamps:true, versionKey:false}
);

UserSchema.pre('findOneAndDelete', async function(){
    const userId = this.getQuery()._id;
    if (!userId) return;
    await GroupModel.updateMany(
        {'member.user': userId},
        {$pull: {members:{user:userId}}}
    ); 
});

export type IUser = InferSchemaType<typeof UserSchema> & {
    _id: mongose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export const UserModel = mongose.model<IUser>('User',UserSchema);
