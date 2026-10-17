import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
import { IColumn } from '../../models/Column';

export const createColumnInputSchema = z.object({
  name: z.string().min(2, { error: 'El nombre debe tener al menos 2 caracteres' }).max(150),
  boardId: mongoIdSchema,
});
export type CreateColumnInput = z.infer<typeof createColumnInputSchema>;

export const updateColumnInputSchema = z.object({
  columnId: mongoIdSchema,
  name: z.string().min(2).max(150),
});
export type UpdateColumnInput = z.infer<typeof updateColumnInputSchema>;

export const deleteColumnInputSchema = mongoIdSchema;
export type DeleteColumnInput = z.infer<typeof deleteColumnInputSchema>;

export type CreateColumnDatabase = Pick<IColumn, 
'name'>&
{
  boardId: string
};

export type UpdateColumnDatabase = {name: string | undefined};
