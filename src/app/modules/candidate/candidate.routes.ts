import { Router } from "express";
import {
  createCandidateController,
  deleteCandidateController,
  getCandidateController,
  listCandidatesController,
  updateCandidateController,
} from "./candidate.controller";
import { validate } from "../../middleware/validation.middleware";
import { candidateSchema, candidateUpdateSchema } from "./candidate.validation";

export const candidateRouter = Router();

candidateRouter.get("/", listCandidatesController);
candidateRouter.post("/", validate(candidateSchema), createCandidateController);
candidateRouter.get("/:id", getCandidateController);
candidateRouter.patch(
  "/:id",
  validate(candidateUpdateSchema),
  updateCandidateController,
);
candidateRouter.delete("/:id", deleteCandidateController);
