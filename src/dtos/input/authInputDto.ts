import { z } from 'zod';
import { uploadFileInputRequestSchema } from '../../utils/FileDto';

export const registerInputSchema = z.object({
    name: z.string().min(2, { error: 'El nombre debe contener al menos 2 caracteres' }).max(100),
    email: z.email({ error: 'Debe ser un correo electronico valido' }),
    document: z.string().min(5, { error: 'El documento debe tener al menos 5 caracteres' }),
    password: z.string().min(6, { error: 'La contraseña debe tener almenos 6 caracteres' }),
    profilePicture: uploadFileInputRequestSchema.optional()
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
    email: z.email({error: 'Formato de correo invalido'}),
    password: z.string().min(1, {error: 'La constraseña es obligatoria'})
});

export type LoginInput = z.infer<typeof loginInputSchema>;