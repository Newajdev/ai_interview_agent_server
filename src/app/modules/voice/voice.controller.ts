import { NextFunction, Request, Response } from "express";
import { answerAndGenerateQuestion } from "../interview/interview.service";
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

export async function processInterviewResponse(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (!request.file) {
      response.status(400).json({ error: "An audio file is required." });
      return;
    }
    const { interviewId } = request.body as { interviewId: string };
    const transcript = await speechToTextService.transcribe(
      request.file.buffer,
      request.file.originalname,
      request.file.mimetype,
    );
    const result = await answerAndGenerateQuestion(interviewId, transcript);
    if (!result) {
      response.status(404).json({ error: "Interview not found." });
      return;
    }
    if ("conflict" in result) {
      response.status(409).json({ error: "Interview is not in progress." });
      return;
    }
    if ("expired" in result) {
      response.status(409).json({ error: "Interview time has expired." });
      return;
    }
    if (!("question" in result)) {
      response.status(500).json({ error: "Unable to generate the next interview question." });
      return;
    }
    const audio = await textToSpeechService.synthesize(result.question.content);
    response.json({
      transcript,
      question: result.question.content,
      audio: {
        contentType: "audio/wav",
        base64: audio.toString("base64"),
      },
    });
  } catch (error) {
    next(error);
  }
}
