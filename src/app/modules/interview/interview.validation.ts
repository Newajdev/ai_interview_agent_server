import { z } from "zod";

export const createInterviewSchema = z.object({
  candidateId: z.string().trim().min(1),
});

export const messageSchema = z.object({
  content: z.string().trim().min(1).max(20_000),
  role: z.enum(["AI", "CANDIDATE", "SYSTEM"]).default("CANDIDATE"),
});
