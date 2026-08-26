function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function interviewReportTemplate(
  candidateName: string,
  summary: string,
) {
  return `Hello ${candidateName},\n\n${summary}\n\nAI Interview Project`;
}

export function interviewReportHtml(candidateName: string, summary: string) {
  const safeName = escapeHtml(candidateName);
  const safeSummary = escapeHtml(summary).replace(/\r?\n/g, "<br />");
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4f7fb;color:#172033;font-family:Arial,sans-serif;line-height:1.6">
    <main style="max-width:640px;margin:32px auto;padding:32px;background:#ffffff;border:1px solid #e5eaf2;border-radius:12px">
      <p style="margin:0 0 8px;color:#2563eb;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">AI Interview Project</p>
      <h1 style="margin:0 0 20px;font-size:24px">Your interview report</h1>
      <p>Hello ${safeName},</p>
      <p>${safeSummary}</p>
      <p style="margin:28px 0 0;color:#64748b;font-size:13px">Thank you for completing your interview.</p>
    </main>
  </body>
</html>`;
}
