import { env } from "../../config/env";

export interface OcrProvider {
  extractText(image: Buffer, mimeType: string): Promise<string>;
}

class GroqOcrProvider implements OcrProvider {
  async extractText(image: Buffer, mimeType: string) {
    if (!env.GROQ_API_KEY)
      throw new Error("GROQ_API_KEY is required for image OCR.");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          temperature: 0,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all readable text from this CV image. Return only the extracted text.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${image.toString("base64")}`,
                  },
                },
              ],
            },
          ],
        }),
      },
    );
    if (!response.ok)
      throw new Error(`Groq OCR failed: ${await response.text()}`);

    const result = (await response.json()) as {
      choices?: [{ message?: { content?: string } }];
    };
    const text = result.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Groq OCR returned no text.");
    return text;
  }
}

export const ocrProvider: OcrProvider = new GroqOcrProvider();

export function extractImageText(buffer: Buffer, mimeType = "image/jpeg") {
  return ocrProvider.extractText(buffer, mimeType);
}
