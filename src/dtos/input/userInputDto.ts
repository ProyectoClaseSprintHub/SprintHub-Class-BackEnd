import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
import { uploadFileInputRequestSchema } from '../../utils/FileDto';

export const updateUserInputSchema = z.object({
    name: z.string().min(2, {message: 'El nombre debe contener al menos 2 carecteres'}).max(100),
    email: z.string().email({message: 'Debe ser un correo electronico valido'}),
    document: z.string().min(5, {message: 'El documento debetener al menos 5 caracteres'}),
    password: z.string().min(6, {message: 'La contraseña debe tener al menos 6 caracteres'}),
    profilePicture: uploadFileInputRequestSchema.optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const deleteUserInputSchema = mongoIdSchema;
export type deleteUserInput = z.infer<typeof deleteUserInputSchema>;

export const getUserByIdInputSchema = mongoIdSchema;
export type getUserByIdInput = z.infer<typeof getUserByIdInputSchema>;
