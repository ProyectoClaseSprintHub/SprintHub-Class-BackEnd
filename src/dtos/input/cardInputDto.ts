import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
import { ICard } from '../../models/Card';

export const  createCardInputSchema = z.object({
  title: z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }),
  description: z.string().optional().default(''),
  columnId: mongoIdSchema,
  assignedTo: mongoIdSchema.optional(),
  priority: z.enum(['alta', 'media', 'baja']).optional().default('media'),
});
export type CreateCardInput = z.infer<typeof createCardInputSchema>;

export const updateCardInputSchema = z.object({
  cardId: mongoIdSchema,
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  columnId: mongoIdSchema,
  assignedTo: mongoIdSchema.optional(),
  priority: z.enum(['alta', 'media', 'baja']).optional(),
});


export type UpdateCardInput = z.infer<typeof updateCardInputSchema>;

export const deleteCardInputSchema = mongoIdSchema;
export type DeleteCardInput = z.infer<typeof deleteCardInputSchema>;

export type CreateCardDatabase = Pick<ICard,
'title' |
'description' |
'dueDate' |
'priority'> &
{
  columnId: string,
  assignedTo?: string 
};

export type UpdateCardDatabase = Partial<Pick<ICard,
'description'|
'title' | 
'priority' >> &
{
  columnId?: string,
  assignedTo?: string
};