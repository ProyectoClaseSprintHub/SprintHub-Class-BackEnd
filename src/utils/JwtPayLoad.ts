import z from 'zod';

const JwtPayloadSchema = z.object({
    userId: z.string(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;