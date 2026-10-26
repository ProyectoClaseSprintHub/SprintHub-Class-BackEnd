import { fileTypeFromBuffer } from 'file-type';
import { string, z } from 'zod';

export const uploadFileInputSchema = z.object({
    buffer: z.custom<Buffer | Uint8Array>((val) => {
      return val instanceof Buffer || val instanceof Uint8Array;
    }, {
      message: "Debe ser un Buffer o Uint8Array válido"
    }),
    fileName: string(),
    mimeType: string(),
    path: string()
});

export type UploadFileInputDto = z.infer<typeof uploadFileInputSchema>;

export const uploadFileResultSchema = z.object({
    path: z.string(),
    fileName: z.string(),
    url: string()
})

export type UploadFileResultDto = z.infer<typeof uploadFileResultSchema>;

const ALLOWED_MIMES = [
  'image/png', 'image/jpeg', 'image/webp',
  'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/m4a',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
];


const MAX_FILE_SIZE = 15 * 1024 * 1024;

export const uploadFileInputRequestSchema = z.object({
  fileName: z.string(),
  buffer: z.custom<Buffer | Uint8Array>((val) => {
    return val instanceof Buffer || val instanceof Uint8Array;
  }, {
    message: "Debe ser un Buffer o Uint8Array válido"
  })
})
.superRefine(async (file, ctx) => {

  if (file.buffer.length > MAX_FILE_SIZE) {
    ctx.addIssue({
      code: 'custom',
      message: 'El archivo supera el límite máximo de 15MB.'
    });
    return;
  }

  const detectedType = await fileTypeFromBuffer(file.buffer);
  if (!detectedType || !ALLOWED_MIMES.includes(detectedType.mime)) {
    ctx.addIssue({
    	code: 'custom',
      message: 'Formato de archivo no válido o contenido corrupto.'
    });
  }

})
.transform(async (file) => {

  const detectedType = await fileTypeFromBuffer(file.buffer);
  
  return {
    fileName: file.fileName,
    buffer: file.buffer,
    mimeType: detectedType?.mime ?? 'application/octet-stream'
  };
  
});

export type UploadFileInputRequest = z.infer<typeof uploadFileInputRequestSchema>;

