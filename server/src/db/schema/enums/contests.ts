import { pgEnum } from "drizzle-orm/pg-core";

export const contestTypeEnum = pgEnum("contest_type", [
  "live",
  "take-home",
  "practise",
  "upsolve",
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
