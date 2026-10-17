import { Request, Response } from 'express';
import { UserService } from '../service/userService';
import { mongoIdSchema } from '../utils/idValidator';
import { updateUserInputSchema } from '../dtos/input/userInputDto';

export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  async getInfoMe(req: Request, res: Response) {
    try {
      const userId = req.user.userId;

      const user = await this.userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {

    try {

      const userId = req.user.userId;

      const file = req.file 
      ? { fileName: req.file.originalname, buffer: req.file.buffer}
      : undefined;

      const data = await updateUserInputSchema.parseAsync({...req.body, ...(file && {profilePicture: file})});

      const updatedUser = await this.userService.updateUser(
        data,
        userId
      );

      return res.status(200).json(updatedUser);

    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }

  }

  async deleteUser(req: Request, res: Response) {
    try {

      const userId = req.user.userId;

      const deletedUser = await this.userService.deleteUser(userId);

      return res.status(200).json({
        message: 'Usuario eliminado',
        data: deletedUser,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

}
