import { GroupDetailsResponse, GroupResponse, GroupWithDetailsResponse } from "../dtos/response/groupResponseDto";
import { IGroup } from "../models/Groups";

export class GroupMapper {

  public static toResponse(group: IGroup): GroupResponse {
    return {
      id: group._id.toString(),
      name: group.name,
      description: group.description || '',
      profilePicture: group.profilePicture?.url || '',
    };
  }


  public static toDetailsResponse(group: GroupWithDetailsResponse): GroupDetailsResponse {
    return {
      id: group._id.toString(),
      name: group.name,
      description: group.description || '',
      profilePicture: group.profilePicture?.url || '',
      members: (group.members || []).map(members => ({
        id: members.user._id.toString(),
        name: members.user.name,
        email: members.user.email,
        role: members.role,
      })),
    };
  }
}