import { z } from 'zod';

export const mongoIdSchema = z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    'El ID proporcionado no tiene un formato válido.'
);