import { Prisma } from "../../../generated/client/client";
import { prisma } from "../../config/database";
import type { CandidateInput } from "./candidate.types";

const candidateInclude = {
  profile: true,
  _count: { select: { interviews: true } },
} as const;

function profileData(profile: NonNullable<CandidateInput["profile"]>) {
  return {
    professionalTitle: profile.professionalTitle,
    phone: profile.phone,
    skills: profile.skills as Prisma.InputJsonValue | undefined,
    experience: profile.experience as Prisma.InputJsonValue | undefined,
    education: profile.education as Prisma.InputJsonValue | undefined,
    projects: profile.projects as Prisma.InputJsonValue | undefined,
    rawCvText: profile.rawCvText,
    structuredData: profile.structuredData as Prisma.InputJsonValue | undefined,
  };
}

export async function createCandidate(input: CandidateInput) {
  return prisma.candidate.create({
    data: {
      name: input.name,
      email: input.email,
      ...(input.profile
        ? { profile: { create: profileData(input.profile) } }
        : {}),
    },
    include: candidateInclude,
  });
}

export async function listCandidates() {
  return prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
    include: candidateInclude,
  });
}

export async function getCandidate(id: string) {
  return prisma.candidate.findUnique({
    where: { id },
    include: {
      ...candidateInclude,
      interviews: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function updateCandidate(id: string, input: CandidateInput) {
  return prisma.candidate.update({
    where: { id },
    data: {
      name: input.name,
      email: input.email,
      ...(input.profile
        ? {
            profile: {
              upsert: {
                create: profileData(input.profile),
                update: profileData(input.profile),
              },
            },
          }
        : {}),
    },
    include: candidateInclude,
  });
}

export async function deleteCandidate(id: string) {
  return prisma.candidate.delete({ where: { id } });
}
