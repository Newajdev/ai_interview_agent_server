import type { CandidateProfileInput } from './cv.types';

const skillTerms = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Python', 'Java', 'C++', 'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Figma'];

export function parseCandidateProfile(rawCvText: string): CandidateProfileInput {
  const lines = rawCvText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const email = rawCvText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
  const phone = rawCvText.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0] ?? null;
  const name = lines.find((line) => /^[A-Za-z][A-Za-z .'’-]{2,50}$/.test(line) && !/experience|education|skills/i.test(line)) ?? null;
  const professionalTitle = lines.find((line) => /engineer|developer|designer|manager|analyst|specialist|student/i.test(line)) ?? null;
  const skills = skillTerms.filter((skill) => new RegExp(`\\b${skill.replace('.', '\\.')}`, 'i').test(rawCvText));
  const projects = lines.filter((line) => /project|portfolio|github/i.test(line)).slice(0, 3).map((line) => ({ name: line.slice(0, 80), description: line }));
  return { name, email, phone, professionalTitle, skills, experience: [], projects, rawCvText };
}
