import nodemailer from "nodemailer";
import { env } from "../../config/env";

const transporter =
  env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      })
    : null;

export interface InterviewReportEmail {
  recipient: string;
  candidateName: string;
  summary: string;
}

export async function sendInterviewReport(report: InterviewReportEmail) {
  if (!transporter || !env.EMAIL_FROM) {
    throw new Error("SMTP email configuration is missing");
  }

  return transporter.sendMail({
    from: env.EMAIL_FROM,
    to: report.recipient,
    subject: `Your AI interview report, ${report.candidateName}`,
    text: report.summary,
    html: `<p>${report.summary.replace(/\n/g, "<br />")}</p>`,
  });
}
