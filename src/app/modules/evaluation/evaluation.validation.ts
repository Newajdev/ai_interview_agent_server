import { z } from "zod";

export const evaluationParamsSchema = z.object({
  interviewId: z.string().trim().min(1),
});
