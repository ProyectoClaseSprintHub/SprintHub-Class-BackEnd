import { UserResponse } from "./userResponseDto";
export type AuthLoginResponse={
    token: String;
    user: Omit<UserResponse, 'documento' | "createAt">;
}

export type AuthRegisterResponse={
    name:String;
    email:String;
}

