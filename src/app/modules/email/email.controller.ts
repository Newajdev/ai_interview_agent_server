import type { NextFunction, Request, Response } from "express";
import { sendInterviewReportForInterview } from "./email.service";

export async function sendInterviewReportController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { interviewId, recipient } = request.body as {
      interviewId: string;
      recipient?: string;
    };
    const info = await sendInterviewReportForInterview(interviewId, recipient);
    response.status(202).json({
      message: "Interview report email sent.",
      messageId: info.messageId,
    });
  } catch (error) {
    next(error);
  }
}
