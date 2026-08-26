import { z } from "zod";

export const synthesizeSchema = z.object({
  text: z.string().trim().min(1).max(10_000),
});

export const interviewResponseSchema = z.object({
  interviewId: z.string().trim().min(1),
});
