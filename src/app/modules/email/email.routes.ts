import { Router } from "express";
import { validate } from "../../middleware/validation.middleware";
import { sendInterviewReportController } from "./email.controller";
import { interviewReportRequestSchema } from "./email.validation";

export const emailRouter = Router();

emailRouter.post(
  "/interview-report",
  validate(interviewReportRequestSchema),
  sendInterviewReportController,
);