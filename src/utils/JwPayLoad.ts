import z from 'zod';

const JwPayLoadSchema = z.object({
  userId: z.string(),
});


export type JwPayLoad = z.infer<typeof JwPayLoadSchema>;
