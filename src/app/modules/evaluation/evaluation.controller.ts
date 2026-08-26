import type { NextFunction, Request, Response } from "express";
import {
  evaluateInterview,
  getInterviewEvaluation,
} from "./evaluation.service";

function getInterviewId(request: Request, response: Response) {
  const interviewId = request.params.interviewId;
  if (typeof interviewId !== "string") {
    response.status(400).json({ error: "A valid interview id is required." });
    return null;
  }
  return interviewId;
}

export async function createEvaluationController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const interviewId = getInterviewId(request, response);
    if (!interviewId) return;
    response.status(201).json({ evaluation: await evaluateInterview(interviewId) });
  } catch (error) {
    next(error);
  }
}

export async function getEvaluationController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const interviewId = getInterviewId(request, response);
    if (!interviewId) return;
    const evaluation = await getInterviewEvaluation(interviewId);
    if (!evaluation) {
      response.status(404).json({ error: "Evaluation not found." });
      return;
    }
    response.json({ evaluation });
  } catch (error) {
    next(error);
  }
}