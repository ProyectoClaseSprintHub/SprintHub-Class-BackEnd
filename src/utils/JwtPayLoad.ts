import z from 'zod';

const JwtPayLoadSchema = z.object({
    userId: z.string(),
});

export type JwtPayLoad = z.infer<typeof JwtPayLoadSchema>;