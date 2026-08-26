export type CandidateProfileInput = {
  name: string | null;
  email: string | null;
  phone: string | null;
  professionalTitle: string | null;
  skills: string[];
  experience: { summary: string }[];
  projects: { name: string; description: string }[];
  rawCvText: string;
};
