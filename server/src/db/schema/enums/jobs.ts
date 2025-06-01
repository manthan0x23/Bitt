import { pgEnum } from "drizzle-orm/pg-core";

export const jobTypeEnum = pgEnum("job_type", [
  "internship",
  "full-time",
  "part-time",
]);
export const jobStatusEnum = pgEnum("job_status", [
  "draft",
  "open",
  "closed",
  "archived",
]);
export const screeningTypeEnum = pgEnum("screening_type", [
  "manual",
  "auto-cutoff",
  "multi-stage",
]);
