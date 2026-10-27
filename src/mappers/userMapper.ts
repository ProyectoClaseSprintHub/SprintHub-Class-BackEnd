import { userResponse } from "../dtos/response/userResponseDto";
import { IUser } from "../models/User";

export class UserMapper {

    public static toResponse(user: IUser): userResponse {

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            document: user.document,
            password: user.passwordHash,
            profilepicture: user.profilePicture?.url || ''
        };
    }
}