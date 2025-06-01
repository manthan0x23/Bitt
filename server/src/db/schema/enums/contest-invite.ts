import { pgEnum } from "drizzle-orm/pg-core";

export const contestInviteStatusEnum = pgEnum("contest_invite_status_enum", [
  "accepted",
  "rejected",
  "idle",
  "expired",
]);
