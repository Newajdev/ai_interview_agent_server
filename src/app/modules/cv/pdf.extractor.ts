export async function extractPdfText(buffer: Buffer) {
  const pdf = (await import("pdf-parse")).default;
  const result = await pdf(buffer);
  return result.text.trim();
}
