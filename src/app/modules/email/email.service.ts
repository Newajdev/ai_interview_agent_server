import nodemailer from "nodemailer";
import { env } from "../../config/env";
import { prisma } from "../../config/database";
import {
  interviewReportHtml,
  interviewReportTemplate,
} from "./email.template";

function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

export interface InterviewReportEmail {
  recipient: string;
  candidateName: string;
  summary: string;
}

export async function sendInterviewReport(report: InterviewReportEmail) {
  const transporter = getTransporter();
  if (!transporter || !env.EMAIL_FROM) {
    throw new Error("SMTP email configuration is missing");
  }

  const text = interviewReportTemplate(report.candidateName, report.summary);
  return transporter.sendMail({
    from: env.EMAIL_FROM,
    to: report.recipient,
    subject: `Your AI interview report, ${report.candidateName}`,
    text,
    html: interviewReportHtml(report.candidateName, report.summary),
  });
}

export async function sendInterviewReportForInterview(
  interviewId: string,
  recipient?: string,
) {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: {
      candidate: { include: { profile: true } },
      evaluation: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!interview) throw new Error("Interview not found.");
  const email = recipient ?? interview.candidate.email;
  if (!email) throw new Error("Candidate email is not available.");

  const evaluation = interview.evaluation;
  const summary = evaluation?.summary ?? "Your interview evaluation is being prepared.";
  const reportSummary = [
    summary,
    evaluation?.overallScore != null ? `Overall score: ${evaluation.overallScore}/100` : "",
    evaluation?.technicalScore != null ? `Technical score: ${evaluation.technicalScore}/100` : "",
    evaluation?.communicationScore != null ? `Communication score: ${evaluation.communicationScore}/100` : "",
    evaluation?.problemSolvingScore != null ? `Problem-solving score: ${evaluation.problemSolvingScore}/100` : "",
    `Conversation messages: ${interview.messages.length}`,
  ].filter(Boolean).join("\n\n");

  return sendInterviewReport({
    recipient: email,
    candidateName: interview.candidate.name ?? "Candidate",
    summary: reportSummary,
  });
}
