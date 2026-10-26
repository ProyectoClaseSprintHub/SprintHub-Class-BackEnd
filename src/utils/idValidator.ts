import {z} from 'zod';

export const mongoIdSchema = z.string().regex( 
/^[0-9a-fA-F]{24}$/,
'el id proporcionado no tiene un formato válido de MongoDB'
);
