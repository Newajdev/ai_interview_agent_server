export type InterviewMessageRole = "AI" | "CANDIDATE" | "SYSTEM";

export interface CreateMessageInput {
  role: InterviewMessageRole;
  content: string;
}

export interface InterviewTimerState {
  durationSeconds: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  isExpired: boolean;
}
