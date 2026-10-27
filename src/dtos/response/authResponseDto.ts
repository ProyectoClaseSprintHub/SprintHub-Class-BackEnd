import { userResponse } from "./userResponseDto";

export type AuthLoginResponse = {
  token: string;
  user: Omit<userResponse, 'document' | 'createdAt'>;
};

export type AuthRegisterResponse = {
    name: string;
    email: string;
};