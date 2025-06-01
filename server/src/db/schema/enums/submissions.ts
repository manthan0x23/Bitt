import { pgEnum } from "drizzle-orm/pg-core";

// Submission status enum for robust contest judge tracking
export const submissionStatusEnum = pgEnum("submission_status_enum", [
  "PD", // Pending (received, not yet queued)
  "QU", // In Queue (waiting to be judged)
  "RN", // Running (currently being judged)
  "AC", // Accepted
  "WA", // Wrong Answer
  "TLE", // Time Limit Exceeded
  "MLE", // Memory Limit Exceeded
  "RE", // Runtime Error
  "CE", // Compilation Error
  "OLE", // Output Limit Exceeded
  "PE", // Presentation Error (formatting/output error)
  "IE", // Internal Error (judge system error)
  "SE", // System Error (system/server failure)
  "RJ", // Rejected (manual rejection/policy violation)
]);

export const verdictEnum = pgEnum("code_verdict_enum", [
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

export const languageEnum = pgEnum("code_language_enum", [
  "cpp20",
  "python3",
  "java",
  "javascript",
]);
