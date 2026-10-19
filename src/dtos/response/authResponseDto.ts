import { UserResponse } from "./userResponseDto";

export type AuthLoginResponse ={
    token: string;
    user:Omit<UserResponse, 'documento' | "createdAt">;
}
export type AuthRegisterResponse = {
    name:string;
    email:string;
}