import multer from 'multer';
import path from 'path';
import AppError from '../errors/AppError';

const storage = multer.memoryStorage();

const CLOUDINARY_ALLOWED: Record<string, string[]> = {
  '.png': ['image/png'],
  '.jpg': ['image/jpeg', 'image/pjpeg'],
  '.jpeg': ['image/jpeg', 'image/pjpeg'],
  '.webp': ['image/webp'],
  '.mp3': ['audio/mpeg', 'audio/mp3'],
  '.wav': ['audio/wav', 'audio/x-wav'],
  '.ogg': ['audio/ogg', 'video/ogg'],
  '.m4a': ['audio/x-m4a', 'audio/m4a']
};

const cloudinaryFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  if (!CLOUDINARY_ALLOWED[ext]) {
    return cb(new AppError('Formato no válido. Para Cloudinary solo se permiten imágenes (PNG, JPG, JPEG, WEBP) y audios (MP3, WAV, OGG, M4A).', 400));
  }

  if (!CLOUDINARY_ALLOWED[ext].includes(mimeType)) {
    return cb(new AppError('Alerta de seguridad: El contenido del archivo multimedia no coincide con su extensión.', 400));
  }

  cb(null, true);
};

export const uploadToCloudinary = multer({
  storage,
  fileFilter: cloudinaryFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
    files: 1
  }
});