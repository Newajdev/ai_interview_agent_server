import { Router } from 'express';
import multer from 'multer';
import { acceptedMimeTypes, analyzeCv, uploadCv } from './cv.service';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_req, file, callback) => callback(null, acceptedMimeTypes.includes(file.mimetype)) });
export const cvRouter = Router();
const receiveFile = upload.single('file');

cvRouter.post('/upload', receiveFile, async (request, response, next) => {
  try { if (!request.file) return response.status(400).json({ error: 'A PDF, JPG, or PNG file is required.' }); const document = await uploadCv(request.file); return response.status(201).json({ document: { name: request.file.originalname, size: request.file.size, ...document } }); } catch (error) { return next(error); }
});
cvRouter.post('/analyze', receiveFile, async (request, response, next) => {
  try { if (!request.file) return response.status(400).json({ error: 'A PDF, JPG, or PNG file is required.' }); return response.status(201).json({ candidate: await analyzeCv(request.file) }); } catch (error) { return next(error); }
});
