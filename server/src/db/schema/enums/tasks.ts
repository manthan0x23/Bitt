import { pgEnum } from "drizzle-orm/pg-core";

export const taskStatusEnum = pgEnum("task_status_enum", [
  "pending",
  "in_progress",
  "done",
  "blocked",
]);

export const taskTypeEnum = pgEnum("task_type_enum", [
  "interview_preparation",
  "quiz_edit",
  "contest_edit",
  "problem_creation",
  "bug_fix",
]);

export const taskEntityEnum = pgEnum("task_entity_enum", [
  "interview",
  "quiz",
  "contest_stage",
  "problem",
  "job",
  "none",
]);