import type { NextFunction, Request, Response } from "express";
import {
  addMessage,
  answerAndGenerateQuestion,
  completeInterview,
  createInterview,
  getInterview,
  startInterview,
} from "./interview.service";

function getId(request: Request, response: Response) {
  const id = request.params.id;
  if (typeof id !== "string") {
    response.status(400).json({ error: "A valid interview id is required." });
    return null;
  }
  return id;
}

export async function createInterviewController(request: Request, response: Response, next: NextFunction) {
  try {
    const interview = await createInterview(request.body.candidateId);
    if (!interview) {
      response.status(404).json({ error: "Candidate not found." });
      return;
    }
    response.status(201).json({ interview });
  } catch (error) {
    next(error);
  }
}

export async function startInterviewController(request: Request, response: Response, next: NextFunction) {
  try {
    const id = getId(request, response);
    if (!id) return;
    const result = await startInterview(id);
    if (!result) return void response.status(404).json({ error: "Interview not found." });
    if ("conflict" in result) return void response.status(409).json({ error: "Interview has already started or completed." });
    response.json({ interview: result });
  } catch (error) {
    next(error);
  }
}

export async function getInterviewController(request: Request, response: Response, next: NextFunction) {
  try {
    const id = getId(request, response);
    if (!id) return;
    const interview = await getInterview(id);
    if (!interview) {
      response.status(404).json({ error: "Interview not found." });
      return;
    }
    response.json({ interview });
  } catch (error) {
    next(error);
  }
}

export async function addMessageController(request: Request, response: Response, next: NextFunction) {
  try {
    const id = getId(request, response);
    if (!id) return;
    const result = await addMessage(id, request.body);
    if (!result) return void response.status(404).json({ error: "Interview not found." });
    if ("conflict" in result) return void response.status(409).json({ error: "Interview is not in progress." });
    if ("expired" in result) return void response.status(409).json({ error: "Interview time has expired." });
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function answerController(request: Request, response: Response, next: NextFunction) {
  try {
    const id = getId(request, response);
    if (!id) return;
    const result = await answerAndGenerateQuestion(id, request.body.content);
    if (!result) return void response.status(404).json({ error: "Interview not found." });
    if ("conflict" in result) return void response.status(409).json({ error: "Interview is not in progress." });
    if ("expired" in result) return void response.status(409).json({ error: "Interview time has expired." });
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function completeInterviewController(request: Request, response: Response, next: NextFunction) {
  try {
    const id = getId(request, response);
    if (!id) return;
    const result = await completeInterview(id);
    if (!result) return void response.status(404).json({ error: "Interview not found." });
    if ("conflict" in result) return void response.status(409).json({ error: "Interview is not in progress." });
    response.json({ interview: result });
  } catch (error) {
    next(error);
  }
}
