import { pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { users } from "./users";
import { contests } from "./contests";
import { contestInviteStatusEnum } from "./enums";

export const contestInvite = pgTable(
  "contest_invite",
  {
    id: varchar("id", { length: 256 })
      .notNull()
      .primaryKey()
      .$defaultFn(shortId),

    userId: varchar("user_id", { length: 256 }).references(() => users.id, {
      onDelete: "cascade",
    }),
    contestId: varchar("contest_id", { length: 256 }).references(
      () => contests.id,
      { onDelete: "cascade" }
    ),

    inviteStatus: contestInviteStatusEnum("contest_invite_status")
      .default("idle")
      .notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    expirationTime: timestamp("expiration_time").notNull(),
  },
  (table) => ({
    contestUserIdx: uniqueIndex("contest_invite_contest_user_idx").on(
      table.contestId,
      table.userId
    ),
  })
);
