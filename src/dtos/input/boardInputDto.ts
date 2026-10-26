import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
import { IBoard } from '../../models/Board';

export const createBoardInputSchema = z.object({
  title: z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }).max(150),
  description: z.string().optional().default(''),
  groupId: mongoIdSchema,
});
export type CreateBoardInput = z.infer<typeof createBoardInputSchema>;

export const updateBoardInputSchema = z.object({
  id: mongoIdSchema,
  title: z.string().min(2).max(150).optional(),
  description: z.string().optional(),
});
export type UpdateBoardInput = z.infer<typeof updateBoardInputSchema>;

export const deleteBoardInputSchema = mongoIdSchema;
export type DeleteBoardInput = z.infer<typeof deleteBoardInputSchema>;

export type CreateBoardDatabase = Pick<IBoard,
'description' |
'title'>&
{
  groupId: string
};

export type UpdateBoardDatabase = Partial<Pick<IBoard, 'description' | 'title'>>;
