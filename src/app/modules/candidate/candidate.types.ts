export interface CandidateProfileInput {
	professionalTitle?: string;
	phone?: string;
	skills?: string[];
	experience?: unknown[];
	education?: unknown[];
	projects?: unknown[];
	rawCvText?: string;
	structuredData?: Record<string, unknown>;
}

export interface CandidateInput {
	name?: string;
	email?: string;
	profile?: CandidateProfileInput;
}
