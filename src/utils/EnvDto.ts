import z from 'zod';

export const envSchema = z.object({
  port: z.string().default('3000'),
  mongodburi: z.string().min(1, { error: 'MONGODB_URI es requerida' }),
  jwtsecret: z.string().min(1, { error: 'JWT_SECRET es requerido' }),
  corsOrigin: z.string().min(1, { error: 'CORS_ORIGIN es requerido' }),
  serverUrl: z.string().min(1, { error: 'SERVER_URL es requerida' }),
  cloudinaryName: z.string().min(1, { error: 'CLOUDINARY_CLOUD_NAME es requerida' }),
  cloudinaryApiKey: z.string().min(1, { error: 'CLOUDINARY_API_KEY es requerida' }),
  cloudinaryApiSecret: z.string().min(1, { error: 'CLOUDINARY_API_SECRET es requerida' }),
});

export type EnvDto = z.infer<typeof envSchema>;
