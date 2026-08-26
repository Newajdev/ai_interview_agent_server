import { Router } from "express";
import { prisma } from "../../config/database";

export const interviewRouter = Router();
interviewRouter.post("/", async (request, response, next) => {
  try {
    const { candidateId } = request.body as { candidateId?: string };
    if (!candidateId)
      return response.status(400).json({ error: "candidateId is required." });
    const interview = await prisma.interview.create({ data: { candidateId } });
    return response.status(201).json({ interview });
  } catch (error) {
    return next(error);
  }
});
interviewRouter.post("/:id/start", async (request, response, next) => {
  try {
    const interview = await prisma.interview.update({
      where: { id: request.params.id },
      data: { status: "IN_PROGRESS", startedAt: new Date() },
    });
    return response.json({ interview });
  } catch (error) {
    return next(error);
  }
});
interviewRouter.get("/:id", async (request, response, next) => {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id: request.params.id },
      include: { candidate: { include: { profile: true } }, messages: true },
    });
    return interview
      ? response.json({ interview })
      : response.status(404).json({ error: "Interview not found." });
  } catch (error) {
    return next(error);
  }
});
