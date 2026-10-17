import { UserRepository } from '../repository/userRepository';
import bcrypt from 'bcrypt';
import { UserMapper } from '../mappers/userMapper';
import { UserResponse } from '../dtos/response/userResponseDto';
import { UpdateUserInput } from '../dtos/input/userInputDto';
import AppError from '../errors/AppError';
import CloudinaryStorageService from './storage/cloudinaryStorageService';
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private cloudinaryStorageService: CloudinaryStorageService
  ) {}

  async getUserById(id: string): Promise<UserResponse> {

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('El usuario buscado no existe.', 404);
    }

    return UserMapper.toResponse(user);
  }

  async updateUser(data: UpdateUserInput, userId: string): Promise<UserResponse> {
    
    if(data.email){
      const userFound = await this.userRepository.findByEmail(data.email);
      if(userFound && userFound._id.toString() !== userId){
        throw new AppError('El correo electronico ya esta registrado.', 409);
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    

    let profilePicture = undefined;
    let currentFilePath: string | undefined | null = undefined;

    if (data.profilePicture) {

      const currentUser = await this.userRepository.findById(userId);
      if (!currentUser) {
        throw new AppError('El usuario que se intenta actualizar no existe.', 404);
      }
      
      currentFilePath = currentUser.profilePicture?.path;
      
      profilePicture = await this.cloudinaryStorageService.upload({...data.profilePicture, path: 'UserImage'});

    }

    const updatePayload = {
      name: data.name,
      email: data.email,
      document: data.document,
      passwordHash: data.password,
      ...(profilePicture && { profilePicture })
    };

    const user = await this.userRepository.update(userId, updatePayload);
      
    if (!user) {

      if (profilePicture) {
        await this.cloudinaryStorageService.delete(profilePicture.path);
      }
      throw new AppError('Usuario no encontrado para actualizar', 404);

    }

    if (currentFilePath) {
      await this.cloudinaryStorageService.delete(currentFilePath);
    }

    return UserMapper.toResponse(user);
  }

  async deleteUser(userId: string) {
    
    const deletedUser = await this.userRepository.delete(userId);
    if (!deletedUser) {
      throw new AppError('Usuario no encontrado para eliminar', 404);
    }
    return deletedUser;
  }

}