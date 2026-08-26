import { Router } from "express";
import { cvRouter } from "../modules/cv/cv.routes";
import { interviewRouter } from "../modules/interview/interview.routes";
import { voiceRouter } from "../modules/voice/voice.routes";

export const apiRouter = Router();
apiRouter.get("/health", (_request, response) =>
  response.json({ status: "ok" }),
);
apiRouter.use("/cv", cvRouter);
apiRouter.use("/interviews", interviewRouter);
apiRouter.use("/voice", voiceRouter);
