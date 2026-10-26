import mongoose, { Schema, Document, InferSchemaType } from 'mongoose';
import { BoardModel } from './Board';

const GroupSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        profilePicture: {
            path: { type: String },
            fileName: { type: String },
            url: { type: String }
        },
        members: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                role: { type: String, enum: ['admin', 'member'], default: 'member' }
            }

        ]

    },
    { timestamps: true, versionKey: false }
);

GroupSchema.pre('findOneAndDelete', async function () {
    const groupId = this.getQuery()['_id'];
    const boards = await BoardModel.find({ group: groupId }).select('_id');
    for (const board of boards) {
        await BoardModel.findByIdAndDelete(board._id);
    }
});

export type IGroup = Omit<InferSchemaType<typeof GroupSchema>, 'members'> & {
    _id: mongoose.Types.ObjectId;
    members: {
        user: mongoose.Types.ObjectId;
        role: 'admin' | 'collaborator;'
    }[];
    createdAt : Date;
    updateAt : Date;
};

export type IGroupMember = IGroup['members'][number];
export const GroupModel = mongoose.model<IGroup>('Group', GroupSchema);
