import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
import { uploadFileInputRequestSchema } from '../../utils/FileDto';

export const updateUserInputSchema = z.object({
    name: z.string().min(2, { error: 'El nombre debe contener al menos 2 caracteres' }).max(100),
    email: z.email({ error: 'Debe ser un correo electronico valido' }),
    document: z.string().min(5, { error: 'El documento debe tener al menos 5 caracteres' }),
    password: z.string().min(6, { error: 'La contraseña debe tener almenos 6 caracteres' }),
    profilePicture: uploadFileInputRequestSchema.optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const deleteUserInputSchema = mongoIdSchema;
export type deleteUserInput = z.infer<typeof deleteUserInputSchema>;

export const getUserByIdInputSchema = mongoIdSchema;
export type getUserByIdInputSchema = z.infer<typeof getUserByIdInputSchema>;

