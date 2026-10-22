import{UserResponse} from '../dtos/response/userResponseDto';
import { IUser } from '../models/Users';

export class UserMapper{
    public static toResponse(user: IUser): UserResponse{
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            document: user.documento,
            profilePicture: user.profilePicture?.url || ''
        };
    }
}