export interface EvaluationResult {
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
}

export interface EvaluationProvider {
  evaluate(input: {
    candidateName: string | null;
    messages: { role: string; content: string }[];
  }): Promise<EvaluationResult>;
}
