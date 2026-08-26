import { Router } from "express";
import { cvRouter } from "../modules/cv/cv.routes";
import { candidateRouter } from "../modules/candidate/candidate.routes";
import { interviewRouter } from "../modules/interview/interview.routes";
import { voiceRouter } from "../modules/voice/voice.routes";
import { emailRouter } from "../modules/email/email.routes";
import { evaluationRouter } from "../modules/evaluation/evaluation.routes";

export const apiRouter = Router();
apiRouter.get("/health", (_request, response) =>
  response.json({ status: "ok" }),
);
apiRouter.use("/cv", cvRouter);
apiRouter.use("/candidates", candidateRouter);
apiRouter.use("/interviews", interviewRouter);
apiRouter.use("/voice", voiceRouter);
apiRouter.use("/email", emailRouter);
apiRouter.use("/evaluations", evaluationRouter);
