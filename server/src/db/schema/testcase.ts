import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { problems } from "./problems";

export const testcases = pgTable(
  "testcases",
  {
    id: varchar("id").primaryKey().notNull().$defaultFn(shortId),
    slug: varchar("slug", { length: 256 }).notNull(),

    problemId: varchar("problem_id", { length: 256 })
      .references(() => problems.id, {
        onDelete: "cascade",
      })
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    problemIdx: index("testcases_problem_idx").on(table.problemId),
    slugIdx: index("testcases_slug_idx").on(table.slug),
  })
);
