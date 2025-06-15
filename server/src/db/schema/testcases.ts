import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { contestProblems } from "./contest-problems";
import { testcasesTypeEnum } from "./enums";

export const testcases = pgTable("testcases", {
  id: varchar("id", { length: 256 })
    .notNull()
    .$defaultFn(shortId)
    .primaryKey()
    .unique(),

  contestProblemId: varchar("contest_problem_id", { length: 256 })
    .notNull()
    .references(() => contestProblems.id, {
      onDelete: "cascade",
    }),

  input: varchar("input").notNull(),
  output: varchar("output").notNull(),

  type: testcasesTypeEnum().default("system"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
