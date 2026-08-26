import { Router } from "express";
import multer from "multer";
import { synthesizeSpeech, transcribeAudio } from "./voice.controller";

const acceptedAudioTypes = [
  "audio/webm",
  "audio/wav",
  "audio/mpeg",
  "audio/mp4",
];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_request, file, callback) =>
    callback(null, acceptedAudioTypes.includes(file.mimetype)),
});

export const voiceRouter = Router();
voiceRouter.post("/transcribe", upload.single("audio"), transcribeAudio);
voiceRouter.post("/synthesize", synthesizeSpeech);
