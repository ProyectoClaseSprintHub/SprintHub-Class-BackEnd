import dotenv from 'dotenv';
import { EnvDto, envSchema } from '../utils/EnvDto';
import { ZodError } from 'zod/v3';
dotenv.config();

let env: EnvDto;

try {

  env = envSchema.parse({
    port: process.env.PORT,
    mongodburi: process.env.MONGODB_URi,
    jwtsecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN,
    serverUrl: process.env.SERVER_URL,
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  });

} catch (error: unknown) {
  
  throw new Error(`Variables de entorno no configuradas ${error}`);

}

export default env;
