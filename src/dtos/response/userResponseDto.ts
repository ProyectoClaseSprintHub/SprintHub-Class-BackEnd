import { IUser } from "../../models/User";

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  document: string;
  profilePicture: string;
};

export type UserReference = Pick<IUser, '_id' | 'name' | 'email' | 'profilePicture' >;
