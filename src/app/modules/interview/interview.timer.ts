export const INTERVIEW_DURATION_SECONDS = 30 * 60;

export function getInterviewTimer(startedAt: Date | null, now = new Date()) {
  const elapsedSeconds = startedAt
    ? Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000))
    : 0;
  const remainingSeconds = Math.max(
    0,
    INTERVIEW_DURATION_SECONDS - elapsedSeconds,
  );
  return {
    durationSeconds: INTERVIEW_DURATION_SECONDS,
    elapsedSeconds,
    remainingSeconds,
    isExpired: remainingSeconds === 0,
  };
}
