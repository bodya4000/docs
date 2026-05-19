import multer from 'multer';

export const financialCsvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
}).single('file');

export function isMulterError(err: unknown): err is multer.MulterError {
  return err instanceof multer.MulterError;
}
