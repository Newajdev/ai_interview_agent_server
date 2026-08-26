import { prisma } from "../../config/database";
import { interviewQuestionProvider } from "./interview.orchestrator";
import { getInterviewTimer } from "./interview.timer";
import type { CreateMessageInput } from "./interview.types";

const interviewInclude = {
  candidate: { include: { profile: true } },
  messages: { orderBy: { createdAt: "asc" as const } },
  evaluation: true,
} as const;

export async function createInterview(candidateId: string) {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });
  if (!candidate) return null;
  return prisma.interview.create({
    data: { candidateId },
    include: interviewInclude,
  });
}

export async function getInterview(id: string) {
  const interview = await prisma.interview.findUnique({
    where: { id },
    include: interviewInclude,
  });
  return interview
    ? { ...interview, timer: getInterviewTimer(interview.startedAt) }
    : null;
}

export async function startInterview(id: string) {
  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { candidate: { include: { profile: true } }, messages: true },
  });
  if (!interview) return null;
  if (interview.status !== "DRAFT")
    return { conflict: true as const, interview };
  const question = await interviewQuestionProvider.nextQuestion({
    candidateName: interview.candidate.name,
    professionalTitle: interview.candidate.profile?.professionalTitle ?? null,
    skills: interview.candidate.profile?.skills ?? [],
    messageCount: interview.messages.length,
  });
  return prisma.$transaction(async (transaction) => {
    const started = await transaction.interview.update({
      where: { id },
      data: { status: "IN_PROGRESS", startedAt: new Date() },
      include: interviewInclude,
    });
    await transaction.interviewMessage.create({
      data: { interviewId: id, role: "AI", content: question },
    });
    return { ...started, firstQuestion: question };
  });
}

export async function addMessage(id: string, input: CreateMessageInput) {
  const interview = await prisma.interview.findUnique({ where: { id } });
  if (!interview) return null;
  if (interview.status !== "IN_PROGRESS") return { conflict: true as const };
  if (getInterviewTimer(interview.startedAt).isExpired)
    return { expired: true as const };
  return {
    message: await prisma.interviewMessage.create({
      data: { interviewId: id, ...input },
    }),
  };
}

export async function answerAndGenerateQuestion(id: string, content: string) {
  const answer = await addMessage(id, { role: "CANDIDATE", content });
  if (!answer || "conflict" in answer || "expired" in answer) return answer;
  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { candidate: { include: { profile: true } }, messages: true },
  });
  if (!interview) return null;
  const question = await interviewQuestionProvider.nextQuestion({
    candidateName: interview.candidate.name,
    professionalTitle: interview.candidate.profile?.professionalTitle ?? null,
    skills: interview.candidate.profile?.skills ?? [],
    messageCount: interview.messages.length,
  });
  const nextMessage = await prisma.interviewMessage.create({
    data: { interviewId: id, role: "AI", content: question },
  });
  return { answer: answer.message, question: nextMessage };
}

export async function completeInterview(id: string) {
  const interview = await prisma.interview.findUnique({ where: { id } });
  if (!interview) return null;
  if (interview.status !== "IN_PROGRESS") return { conflict: true as const };
  return prisma.interview.update({
    where: { id },
    data: { status: "COMPLETED", completedAt: new Date() },
    include: interviewInclude,
  });
}
