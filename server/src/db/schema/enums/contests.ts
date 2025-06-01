import { pgEnum } from "drizzle-orm/pg-core";

export const contestTypeEnum = pgEnum("contest_type", ["live", "take-home"]);

export const contestAccessEnum = pgEnum("contest_access", [
  "public",
  "private",
  "invite-only",
]);

export const contestPublishStateEnum = pgEnum("contest_publish_state_enum", [
  "draft",
  "published",
]);
