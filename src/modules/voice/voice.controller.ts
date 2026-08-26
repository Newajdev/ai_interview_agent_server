import { NextFunction, Request, Response } from "express";
import { speechToTextService, textToSpeechService } from "./voice.service";

export async function transcribeAudio(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (!request.file) {
      response.status(400).json({ error: "An audio file is required." });
      return;
    }
    const text = await speechToTextService.transcribe(
      request.file.buffer,
      request.file.originalname,
      request.file.mimetype,
    );
    response.json({ text });
  } catch (error) {
    next(error);
  }
}

export async function synthesizeSpeech(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { text } = request.body as { text?: string };
    if (!text?.trim()) {
      response.status(400).json({ error: "Text is required." });
      return;
    }
    const audio = await textToSpeechService.synthesize(text.trim());
    response.type("wav").send(audio);
  } catch (error) {
    next(error);
  }
}
