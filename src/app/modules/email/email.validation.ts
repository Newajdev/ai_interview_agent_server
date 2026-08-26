import { z } from "zod";

export const interviewReportRequestSchema = z.object({
  interviewId: z.string().trim().min(1),
  recipient: z.string().trim().email().optional(),
});