import { z } from "zod/v4";

export const zodSubmissionStatusEnum = z.enum([
  "PD",
  "QU",
  "RN",
  "AC",
  "WA",
  "TLE",
  "MLE",
  "RE",
  "CE",
  "OLE",
  "PE",
  "IE",
  "SE",
  "RJ",
]);

export type SubmissionStatus = z.infer<typeof zodSubmissionStatusEnum>;

export const zodVerdictEnum = z.enum([
  "Accepted",
  "Wrong Answer",
  "Time Limit Exceeded",
  "Memory Limit Exceeded",
  "Runtime Error",
  "Compilation Error",
  "Output Limit Exceeded",
  "Presentation Error",
  "Internal Error",
  "System Error",
  "Rejected",
  "Pending",
  "In Queue",
  "Running",
  "Plagiarized",
  "Skipped",
]);

export type Verdict = z.infer<typeof zodVerdictEnum>;

export const zodLanguageEnum = z.enum([
  "cpp20",
  "python3",
  "java",
  "javascript",
]);

export type Language = z.infer<typeof zodLanguageEnum>;

export const zCreateSubmissionInput = z.object({
  contestRegisterationId: z
    .string()
    .min(1, "ContestRegisteration ID is required"),
  problemId: z.string().min(1, "Problem ID is required"),
  contestId: z.string().min(1, "Contest ID is required"),
  code: z.string().min(5, "Code must be at least 5 characters"),
  language: zodLanguageEnum,
});
