import { z } from "zod";

const optionalText = z.string().trim().min(1).optional();

export const candidateProfileSchema = z.object({
	professionalTitle: optionalText,
	phone: optionalText,
	skills: z.array(z.string().trim().min(1)).optional(),
	experience: z.array(z.unknown()).optional(),
	education: z.array(z.unknown()).optional(),
	projects: z.array(z.unknown()).optional(),
	rawCvText: z.string().optional(),
	structuredData: z.record(z.string(), z.unknown()).optional(),
});

const candidateFieldsSchema = z.object({
	name: optionalText,
	email: z.string().trim().email().optional(),
	profile: candidateProfileSchema.optional(),
});

export const candidateSchema = candidateFieldsSchema.refine(
	(candidate) => Boolean(candidate.name || candidate.email),
	{ message: "Name or email is required.", path: ["name"] },
);

export const candidateUpdateSchema = candidateFieldsSchema
	.partial()
	.refine(
		(candidate) => Object.keys(candidate).length > 0,
		{ message: "At least one field is required." },
	);
