import { prisma } from "../../config/database";
import type { EvaluationProvider, EvaluationResult } from "./evaluation.types";

class LocalEvaluationProvider implements EvaluationProvider {
  async evaluate(
    input: Parameters<EvaluationProvider["evaluate"]>[0],
  ): Promise<EvaluationResult> {
    const answers = input.messages.filter(
      (message) => message.role === "CANDIDATE",
    );
    const totalWords = answers.reduce(
      (count, message) =>
        count + message.content.trim().split(/\s+/).filter(Boolean).length,
      0,
    );
    const averageWords = answers.length ? totalWords / answers.length : 0;
    const communicationScore = Math.min(
      100,
      Math.round(45 + averageWords * 1.5),
    );
    const technicalScore = Math.min(100, Math.round(40 + answers.length * 8));
    const problemSolvingScore = Math.min(
      100,
      Math.round((technicalScore + communicationScore) / 2),
    );
    const overallScore = Math.round(
      (technicalScore + communicationScore + problemSolvingScore) / 3,
    );

    return {
      technicalScore,
      communicationScore,
      problemSolvingScore,
      overallScore,
      strengths: answers.length
        ? ["Completed the interview conversation."]
        : [],
      weaknesses:
        averageWords < 35
          ? ["Answers could include more supporting detail."]
          : [],
      recommendations: [
        "Use specific examples and measurable outcomes in future answers.",
      ],
      summary: `${input.candidateName ?? "The candidate"} completed the interview with an overall score of ${overallScore}/100.`,
    };
  }
}

export const evaluationProvider: EvaluationProvider =
  new LocalEvaluationProvider();

export async function evaluateInterview(interviewId: string) {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: {
      candidate: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!interview) throw new Error("Interview not found.");
  if (!interview.messages.some((message) => message.role === "CANDIDATE")) {
    throw new Error(
      "At least one candidate answer is required before evaluation.",
    );
  }

  const result = await evaluationProvider.evaluate({
    candidateName: interview.candidate.name,
    messages: interview.messages,
  });

  return prisma.$transaction(async (transaction) => {
    const evaluation = await transaction.interviewEvaluation.upsert({
      where: { interviewId },
      create: {
        interviewId,
        ...result,
      },
      update: result,
    });

    await transaction.interview.update({
      where: { id: interviewId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    return evaluation;
  });
}

export async function getInterviewEvaluation(interviewId: string) {
  return prisma.interviewEvaluation.findUnique({ where: { interviewId } });
}
