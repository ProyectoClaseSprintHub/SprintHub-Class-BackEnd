import { AuthLoginResponse, AuthRegisterResponse } from "../dtos/response/authResponseDto";
import { IUser } from "../models/User";

export class AuthMapper {

  public static toAuthLoginResponse(user: IUser, token: string): AuthLoginResponse {
    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture?.url || '',
      },
    };
  }

  public static toAuthRegisterResponse(user: IUser): AuthRegisterResponse {
    return {
      name: user.name,
      email: user.email,
    };
  }
}
