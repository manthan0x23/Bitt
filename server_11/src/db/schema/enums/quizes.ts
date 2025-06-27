import { pgEnum } from "drizzle-orm/pg-core";

export const quizTypeEnum = pgEnum("quiz_type_enum", [
  "live",
  "take-home",
  "practise",
  "upsolve",
]);

export const quizStatusEnum = pgEnum("quiz_status_enum", [
  "draft",
  "open",
  "closed",
  "archived",
]);


export const quizStateEnum = pgEnum("contest_access", [
  "public",
  "private",
  "invite-only",
]);