import moongose, { Schema, InferSchemaType } from 'mongoose';
import { GroupModel } from './Group';

const userSchema = new Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    document: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    profilePicture: {
        path: { type: String },
        fileName: { type: String },
        url: { type: String }

    }
},
    { timestamps: true, versionKey: false }
);

userSchema.pre('findOneAndDelete', async function () {
    const userId = this.getQuery()._id;
    if (userId) return;
    await GroupModel.updateMany(
        { 'member.user': userId },
        { $pull: { memebers: { user: userId } } }

    );
});

export type IUser = InferSchemaType<typeof userSchema> & {
    _id: moongose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const UserModel = moongose.model<IUser>('User', userSchema);