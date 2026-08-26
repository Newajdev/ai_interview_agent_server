declare module "pdf-parse" {
  interface PdfData {
    text: string;
  }

  type PdfParser = (buffer: Buffer) => Promise<PdfData>;
  const pdfParser: PdfParser;
  export default pdfParser;
}
