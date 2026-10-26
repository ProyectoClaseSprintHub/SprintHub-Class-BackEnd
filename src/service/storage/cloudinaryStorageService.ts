import cloudinary from '../../config/cloudinary';
import { UploadFileInputDto, UploadFileResultDto } from '../../utils/FileDto';
import ValidationError from '../../errors/ValidationError';

class CloudinaryStorageService {

  async upload(fileData: UploadFileInputDto): Promise<UploadFileResultDto> {

    return new Promise((resolve, reject) => {

    const uniqueFileName = crypto.randomUUID();
    const folderPath = fileData.path ? fileData.path : '';

    const uploadStream = cloudinary.uploader.upload_stream(
        {
        folder: folderPath,
        public_id: uniqueFileName,
        resource_type: 'auto',
        },
        (error, result) => {
        if (error || !result) {
            return reject(new ValidationError(`Error al subir el archivo: ${error?.message || 'Error desconocido'}`));
        }


        resolve({
            path: result.public_id,
            fileName: fileData.fileName,
            url: result.secure_url,
        });
        }
    );
    uploadStream.end(fileData.buffer);
    });
    
}

async delete(filePath: string): Promise<void> {

    try {

        const result = await cloudinary.uploader.destroy(filePath, {invalidate: true});

        if (result.result !== 'ok' && result.result !== 'not_found') {
        throw new Error(result.result);
        }

    } catch (error: any) {
    throw new ValidationError(`Error al eliminar el archivo: ${error.message}`);
    }

}

async deleteMany(filePaths: string[]): Promise<void> {

    if (filePaths.length === 0) {
    return;
    }

    try {
    await cloudinary.api.delete_resources(filePaths, {invalidate: true});
    } catch (error: any) {
    throw new ValidationError(`Error al eliminar los archivos: ${error.message}`);
    }
    
}

}

export default CloudinaryStorageService;
