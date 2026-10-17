import { AuthLoginResponse, AuthRegisterResponse } from '../dtos/response/authResponseDto';
import { LoginInput, RegisterInput } from '../dtos/input/authInputDto';
import { UserRepository } from '../repository/userRepository';
import { JwtPayload } from '../utils/JwtPayload';
import { AuthMapper } from '../mappers/authMapper';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from '../config/env';
import CloudinaryStorageService from './storage/cloudinaryStorageService';
import AppError from '../errors/AppError';


export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private cloudinaryStorageService: CloudinaryStorageService
  ) {}

  async register(data: RegisterInput): Promise<void> {

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError('El correo electrónico ya está registrado', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    let profilePicture = undefined;

    try{

      if(data.profilePicture){
        profilePicture = await this.cloudinaryStorageService.upload({...data.profilePicture, path: 'UserImages'});
      }

      await this.userRepository.create({
        name : data.name,
        email: data.email,
        document: data.document,
        passwordHash,
        ...(profilePicture && {profilePicture})
      });

    }catch(error: unknown){

      if(profilePicture){
        await this.cloudinaryStorageService.delete(profilePicture.path);
      }

      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

      throw new AppError(`Error al crear el usuario ${errorMessage}`, 500);

    }

  }

  async login(data: LoginInput): Promise<AuthLoginResponse> {

    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
    };

    const token = jwt.sign(payload, env.jwtsecret, {
      expiresIn: '1d',
    });

    return AuthMapper.toAuthLoginResponse(user, token);

  }
}