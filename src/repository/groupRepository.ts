import { GroupWithDetailsResponse } from '../dtos/response/groupResponseDto';
import { UserReference } from '../dtos/response/userResponseDto';
import { GroupModel, IGroup } from '../models/Group';

export class GroupRepository {  
  
  async findById(id: string): Promise<GroupWithDetailsResponse | null> {
    return GroupModel.findById(id)
      .populate <UserReference> ({
        path: 'members.user',
        select: '_id name email profilePicture' 
      })
      .lean<GroupWithDetailsResponse | null>()
      .exec();
  }

  async findByUserId(userId: string): Promise<GroupWithDetailsResponse[]> {
    return GroupModel.find({ 'members.user': userId })
      .populate <UserReference> ({
        path: 'members.user',
        select: '_id name email profilePicture' 
      })
      .lean<GroupWithDetailsResponse[]>()
      .exec();
  }

  async create(
  data: Pick<IGroup, 'name' | 'description' | 'profilePicture'>,
  creatorId: string,
): Promise<IGroup> {
  const group = await GroupModel.create({
    ...data,
    members: [
      { 
        user: creatorId, 
        role: 'admin' 
      }
    ],
  });

  return group.toObject();
}

  async update(
    id: string,
    data: Partial<Pick<IGroup, 'name' | 'description' | 'profilePicture'>>,
  ): Promise<GroupWithDetailsResponse | null> {
    return GroupModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    })
    .populate <UserReference> ({
        path: 'members.user',
        select: '_id name email profilePicture' 
      })
      .lean<GroupWithDetailsResponse | null>()
      .exec();
  }

  async addMember(
    groupId: string,
    userId: string,
    role: 'admin' | 'collaborator',
  ): Promise<GroupWithDetailsResponse | null> {
    return GroupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: { user: userId, role } } },
      { returnDocument: 'after', runValidators: true },
    )
      .populate <UserReference> ({
        path: 'members.user',
        select: '_id name email profilePicture' 
      })
      .lean<GroupWithDetailsResponse | null>()
      .exec();
  }

  async removeMember(groupId: string, userId: string): Promise<GroupWithDetailsResponse | null> {
    return GroupModel.findByIdAndUpdate(
      groupId,
      { $pull: { members: { user: userId } } },
      { returnDocument: 'after' },
    )
      .populate <UserReference> ({
        path: 'members.user',
        select: '_id name email profilePicture' 
      })
      .lean<GroupWithDetailsResponse | null>()
      .exec();
  }

  async updateMemberRole(groupId: string, userId: string, role: 'admin' | 'collaborator'): Promise<GroupWithDetailsResponse | null> {
    return GroupModel.findOneAndUpdate(
      { _id: groupId, 'members.user': userId },
      { $set: { 'members.$.role': role } },
      { returnDocument: 'after', runValidators: true }
    ).populate <UserReference> ({
        path: 'members.user',
        select: '_id name email profilePicture' 
      })
      .lean<GroupWithDetailsResponse | null>()
      .exec();
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const exists = await GroupModel.exists({
      _id: groupId,
      'members.user': userId,
    });
    return exists !== null;
  }

  async isMemberAndRoleValid(groupId: string, userId: string, roles: string[]): Promise<boolean> {
   
    const resultado = await GroupModel.exists({
      _id: groupId,
      members: { $elemMatch: { user: userId, role: { $in: roles } } },
    });

    return !!resultado;
  }

  async delete(id: string): Promise<boolean> {
    const result = await GroupModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async existById(id: string): Promise<boolean> {
    return (await GroupModel.exists({ _id: id })) !== null;
  }
  
}