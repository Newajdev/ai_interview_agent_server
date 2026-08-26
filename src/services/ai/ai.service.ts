import { parseCandidateProfile } from "../../modules/cv/cv.parser";
import type { CandidateProfileInput } from "../../modules/cv/cv.types";

export interface AiProvider {
  parseCv(rawCvText: string): Promise<CandidateProfileInput>;
}

/** Local deterministic implementation; replace only this provider when an AI vendor is configured. */
class LocalProfileProvider implements AiProvider {
  async parseCv(rawCvText: string) {
    return parseCandidateProfile(rawCvText);
  }
}

export const aiService: AiProvider = new LocalProfileProvider();
