import { Readable } from 'node:stream';
import { prisma } from '../../config/database';
import { cloudinary, isCloudinaryConfigured } from '../../config/cloudinary';
import { aiService } from '../../services/ai/ai.service';

export const acceptedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

export async function uploadCv(file: Express.Multer.File) {
  if (!isCloudinaryConfigured) return { url: null, storage: 'local-only' as const };
  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto', folder: 'ai-interview-cvs' }, (error, uploaded) => error || !uploaded ? reject(error ?? new Error('Upload failed')) : resolve(uploaded));
    Readable.from(file.buffer).pipe(stream);
  });
  return { url: result.secure_url, storage: 'cloudinary' as const };
}

export async function analyzeCv(file: Express.Multer.File) {
  let rawCvText = '';
  if (file.mimetype === 'application/pdf') {
    const pdf = (await import('pdf-parse')).default;
    rawCvText = (await pdf(file.buffer)).text;
  } else {
    rawCvText = `Image CV uploaded: ${file.originalname}. OCR is required to extract its contents.`;
  }
  const parsed = await aiService.parseCv(rawCvText);
  const candidate = await prisma.candidate.create({
    data: { name: parsed.name, email: parsed.email, profile: { create: { phone: parsed.phone, professionalTitle: parsed.professionalTitle, skills: parsed.skills, experience: parsed.experience, projects: parsed.projects, rawCvText: parsed.rawCvText, structuredData: parsed } } },
    include: { profile: true },
  });
  return { id: candidate.id, ...parsed };
}
