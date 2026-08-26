import { Router } from "express";
import {
  createEvaluationController,
  getEvaluationController,
} from "./evaluation.controller";

export const evaluationRouter = Router();

evaluationRouter.post("/:interviewId", createEvaluationController);
evaluationRouter.get("/:interviewId", getEvaluationController);
