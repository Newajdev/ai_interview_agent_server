export interface SpeechToTextProvider {
  transcribe(
    audio: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<string>;
}

export interface TextToSpeechProvider {
  synthesize(text: string): Promise<Buffer>;
}

export interface VoiceProvider
  extends SpeechToTextProvider, TextToSpeechProvider {}

export class MissingVoiceProviderKeyError extends Error {
  constructor() {
    super("GROQ_API_KEY is not configured");
    this.name = "MissingVoiceProviderKeyError";
  }
}

const groqApiUrl = "https://api.groq.com/openai/v1";

function requireGroqApiKey() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new MissingVoiceProviderKeyError();
  return apiKey;
}

async function readGroqError(response: Response) {
  const body = await response.text();
  return body || `Groq request failed with status ${response.status}`;
}

export const groqVoiceProvider: VoiceProvider = {
  async transcribe(audio, filename, mimeType) {
    const formData = new FormData();
    const audioBuffer = new Uint8Array(audio).buffer as ArrayBuffer;
    formData.append(
      "file",
      new Blob([audioBuffer], { type: mimeType }),
      filename,
    );
    formData.append("model", "whisper-large-v3-turbo");
    formData.append("response_format", "json");

    const response = await fetch(`${groqApiUrl}/audio/transcriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${requireGroqApiKey()}` },
      body: formData,
    });
    if (!response.ok) throw new Error(await readGroqError(response));

    const result = (await response.json()) as { text?: string };
    if (!result.text) throw new Error("Groq returned an empty transcription");
    return result.text;
  },

  async synthesize(text) {
    const response = await fetch(`${groqApiUrl}/audio/speech`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requireGroqApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "canopylabs/orpheus-v1-english",
        input: text,
        voice: "autumn",
        response_format: "wav",
      }),
    });
    if (!response.ok) throw new Error(await readGroqError(response));
    return Buffer.from(await response.arrayBuffer());
  },
};

export const speechToTextService: SpeechToTextProvider = groqVoiceProvider;
export const textToSpeechService: TextToSpeechProvider = groqVoiceProvider;
