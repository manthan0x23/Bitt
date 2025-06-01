import {
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { contests } from "./contests";
import { users } from "./users";

export const contestRegisterations = pgTable(
  "contest_registrations",
  {
    id: varchar("id", { length: 256 })
      .notNull()
      .primaryKey()
      .$defaultFn(shortId),

    contestId: varchar("contest_id", { length: 256 })
      .references(() => contests.id, {
        onDelete: "cascade",
      })
      .notNull(),

    registeredUserId: varchar("registered_user_id", { length: 256 })
      .references(() => users.id, {
        onDelete: "restrict",
      })
      .notNull(),

    registeredAt: timestamp("registered_at").defaultNow(),
  },
  (table) => ({
    uniqueContestUser: uniqueIndex(
      "contest_registrations_unique_contest_user_registration"
    ).on(table.contestId, table.registeredUserId),
  })
);
