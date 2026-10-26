import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
import { uploadFileInputRequestSchema } from '../../utils/FileDto';

export const createGroupInputSchema = z.object({
  name: z.string().min(2, { error: 'El nombre debe tener al menos 2 caracteres' }).max(100),
  description: z.string().optional().default(''),
  filePicture: uploadFileInputRequestSchema.optional()
});
export type CreateGroupInput = z.infer<typeof createGroupInputSchema>;

export const updateGroupInputSchema = z.object({
  groupId: mongoIdSchema,
  name: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
  filePicture: uploadFileInputRequestSchema.optional()
});
export type UpdateGroupInput = z.infer<typeof updateGroupInputSchema>;

export const addGroupMemberInputSchema = z.object({
  groupId: mongoIdSchema,
  email: z.email({ error: 'Debe ser un correo válido' }),
  role: z.enum(['admin', 'collaborator']),
});
export type AddGroupMemberInput = z.infer<typeof addGroupMemberInputSchema>;

export const removeGroupMemberInputSchema = z.object({
  groupId: mongoIdSchema,
  userId: mongoIdSchema,
});
export type RemoveGroupMemberInput = z.infer<typeof removeGroupMemberInputSchema>;

export const updateGroupMemberRoleInputSchema = z.object({
  groupId: mongoIdSchema,
  userId: mongoIdSchema,
  role: z.enum(['admin', 'collaborator']),
});
export type UpdateGroupMemberRoleInput = z.infer<typeof updateGroupMemberRoleInputSchema>;
