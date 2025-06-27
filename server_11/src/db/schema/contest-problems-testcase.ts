import {
  index,
  pgTable,
  integer,
  timestamp,
  varchar,
  unique,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { contestProblems } from "./contest-problems";

export const contestProblemsTestcases = pgTable(
  "contest_problems_testcases",
  {
    id: varchar("id").primaryKey().notNull().$defaultFn(shortId),
    slug: varchar("slug", { length: 256 }).notNull(),

    testCaseIndex: integer("test_case_index").notNull(),

    problemId: varchar("problem_id", { length: 256 })
      .references(() => contestProblems.id, {
        onDelete: "cascade",
      })
      .notNull(),

    points: integer("points"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    problemIdx: index("contest_problems_testcases_problem_idx").on(
      table.problemId
    ),
    slugIdx: index("contest_problems_testcases_slug_idx").on(table.slug),
    uniqueTestCaseIndex: unique("unique_test_case_index_problem_idx").on(
      table.testCaseIndex,
      table.problemId
    ),
  })
);
