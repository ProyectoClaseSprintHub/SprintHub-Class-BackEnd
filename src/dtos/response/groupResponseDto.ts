import { IGroup } from '../../models/Group';
import { UserReference } from './userResponseDto';

export type GroupWithDetailsResponse = Omit<IGroup, 'members'> & {
  members: {
    user: UserReference;
    role: 'admin' | 'collaborator';
  }[];
};

export type GroupResponse = {
  id: string;
  name: string;
  description: string;
  profilePicture: string;
};

export type GroupDetailsResponse = GroupResponse & {
  members: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'collaborator';
  }[];
};
