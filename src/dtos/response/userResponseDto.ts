import {IUser}from "../../models/User";

export type userResponse = {
    id: string;
    name: string;
    email: string;
    document: string;
    password: string;
    profilepicture: string;
}

export type UserReference = Pick<IUser, '_id' | 'name' | 'email' | 'passwordHash' |'profilePicture'>;