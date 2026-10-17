import { Request, Response } from 'express';
import { AuthService } from '../service/authService';
import { loginInputSchema, registerInputSchema } from '../dtos/input/authInputDto';


export class AuthController{

  constructor(private readonly authService: AuthService) {}


async register(req: Request, res: Response) {
  try {

    const file = req.file 
      ? { fileName: req.file.originalname, buffer: req.file.buffer}
      : undefined;

    const data = await registerInputSchema.parseAsync({...req.body, ...(file && {profilePicture: file})});

    await this.authService.register(data);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error en el servidor al registrar usuario' });
  }
}

  async login (req: Request, res: Response) {
  try {

    const validation = loginInputSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: 'Credenciales inválidas', errors: validation.error.format() });
      return;
    }

    const result = await this.authService.login(validation.data);
    res.json({
      message: 'Sesión iniciada correctamente',
      token: result.token,
      user: result.user
    });
    
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error en el servidor al iniciar sesión' });
  }
}
}
