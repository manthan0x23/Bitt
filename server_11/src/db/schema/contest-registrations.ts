import { pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { contests } from "./contests";
import { users } from "./users";
import { jobRegistrations } from "./job-registrations";

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

    jobRegistrationId: varchar("job_registration_id", {
      length: 256,
    }).references(() => jobRegistrations.id),

    registeredAt: timestamp("registered_at").defaultNow(),
  },
  (table) => ({})
);
