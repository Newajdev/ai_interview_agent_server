export interface StoredDocument {
  url: string;
  publicId: string;
}

export async function uploadDocument(
  _filePath: string,
): Promise<StoredDocument> {
  throw new Error(
    "Cloudinary storage integration is not implemented in STEP 1",
  );
}
