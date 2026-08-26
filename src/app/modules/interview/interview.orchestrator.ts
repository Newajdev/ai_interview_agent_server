export interface InterviewContext {
  candidateName: string | null;
  professionalTitle: string | null;
  skills: unknown;
  messageCount: number;
}

export interface InterviewQuestionProvider {
  nextQuestion(context: InterviewContext): Promise<string>;
}

class LocalInterviewQuestionProvider implements InterviewQuestionProvider {
  async nextQuestion(context: InterviewContext) {
    if (context.messageCount === 0) {
      return `Hello ${context.candidateName ?? "there"}. Please introduce yourself and tell me about your recent experience.`;
    }
    if (context.messageCount === 2 && context.professionalTitle) {
      return `What has been the most important challenge in your work as a ${context.professionalTitle}?`;
    }
    return "Can you walk me through a project where you made an important technical decision?";
  }
}

export const interviewQuestionProvider: InterviewQuestionProvider =
  new LocalInterviewQuestionProvider();
