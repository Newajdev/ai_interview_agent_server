import { Readable } from "node:stream";
import { prisma } from "../../config/database";
import { cloudinary, isCloudinaryConfigured } from "../../config/cloudinary";
import { aiService } from "../../services/ai/ai.service";
import { extractPdfText } from "./pdf.extractor";
import { extractImageText } from "./ocr.service";
import type { UploadedCv } from "./cv.types";

export const acceptedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];

export async function uploadCv(file: Express.Multer.File): Promise<UploadedCv> {
  if (!isCloudinaryConfigured) {
    return {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: null,
      storage: "local-only",
    };
  }
  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "ai-interview-cvs" },
        (error, uploaded) =>
          error || !uploaded
            ? reject(error ?? new Error("Upload failed"))
            : resolve(uploaded),
      );
      Readable.from(file.buffer).pipe(stream);
    },
  );
  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: result.secure_url,
    storage: "cloudinary",
  };
}

export async function analyzeCv(file: Express.Multer.File) {
  const document = await uploadCv(file);
  const rawCvText =
    file.mimetype === "application/pdf"
      ? await extractPdfText(file.buffer)
      : await extractImageText(file.buffer, file.mimetype);
  if (!rawCvText) throw new Error("No readable text was found in the CV.");
  const parsed = await aiService.parseCv(rawCvText);
  const candidate = await prisma.candidate.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      profile: {
        create: {
          phone: parsed.phone,
          professionalTitle: parsed.professionalTitle,
          skills: parsed.skills,
          experience: parsed.experience,
          projects: parsed.projects,
          rawCvText: parsed.rawCvText,
          structuredData: parsed,
          cvUrl: document.url,
          cvOriginalName: document.originalName,
          cvMimeType: document.mimeType,
          cvSize: document.size,
        },
      },
    },
    include: { profile: true },
  });
  return { id: candidate.id, ...parsed };
}
