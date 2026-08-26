import { Router } from "express";
import { validate } from "../../middleware/validation.middleware";
import {
  addMessageController,
  answerController,
  completeInterviewController,
  createInterviewController,
  getInterviewController,
  startInterviewController,
} from "./interview.controller";
import { createInterviewSchema, messageSchema } from "./interview.validation";

export const interviewRouter = Router();

interviewRouter.post(
  "/",
  validate(createInterviewSchema),
  createInterviewController,
);
interviewRouter.post("/:id/start", startInterviewController);
interviewRouter.post(
  "/:id/messages",
  validate(messageSchema),
  addMessageController,
);
interviewRouter.post(
  "/:id/answer",
  validate(messageSchema.pick({ content: true })),
  answerController,
);
interviewRouter.post("/:id/complete", completeInterviewController);
interviewRouter.get("/:id", getInterviewController);
