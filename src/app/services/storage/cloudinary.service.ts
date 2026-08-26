import { Readable } from "node:stream";
import { cloudinary, isCloudinaryConfigured } from "../../config/cloudinary";

export interface StoredDocument {
  url: string;
  publicId: string;
}

export async function uploadDocument(
  buffer: Buffer,
  folder = "ai-interview-cvs",
): Promise<StoredDocument> {
  if (!isCloudinaryConfigured)
    throw new Error("Cloudinary storage is not configured.");
  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder },
        (error, uploaded) =>
          error || !uploaded
            ? reject(error ?? new Error("Cloudinary upload failed."))
            : resolve(uploaded),
      );
      Readable.from(buffer).pipe(stream);
    },
  );
  return { url: result.secure_url, publicId: result.public_id };
}
