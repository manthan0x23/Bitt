import { pgEnum } from "drizzle-orm/pg-core";

export const contestTypeEnum = pgEnum("contest_type", [
  "live",
  "assignment",
  "practise",
]);

export const contestAccessEnum = pgEnum("contest_access", [
  "public",
  "private",
  "invite-only",
]);

export const contestStateEnum = pgEnum("contest_publish_state_enum", [
  "draft",
  "open",
  "closed",
  "archived",
]);

export const contestProblemDifficultyEnum = pgEnum(
  "contest_problem_difficulty_enum",
  ["easy", "medium", "hard"]
);
