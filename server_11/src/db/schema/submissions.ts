import {
  pgTable,
  timestamp,
  varchar,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { submissionStatusEnum, verdictEnum, languageEnum } from "./enums";
import { contestRegisterations } from "./contest-registrations";
import { contestProblems } from "./contest-problems";

export const submissions = pgTable(
  "submissions",
  {
    id: varchar("id", { length: 64 })
      .notNull()
      .primaryKey()
      .$defaultFn(shortId),

    contestRegisterationId: varchar("contest_registeration_id", { length: 256 })
      .notNull()
      .references(() => contestRegisterations.id, { onDelete: "cascade" }),

    problemId: varchar("problem_id", { length: 256 })
      .notNull()
      .references(() => contestProblems.id),

    contestId: varchar("contest_id", { length: 256 }),

    codeKey: varchar("code_key", { length: 512 }).notNull(),

    language: languageEnum("language").notNull(),

    submissionStatus: submissionStatusEnum("submission_status")
      .notNull()
      .default("QU"),

    verdict: verdictEnum("verdict"),
    score: integer("score").default(0),

    executionTimeMs: integer("execution_time_ms"),
    memoryUsedKb: integer("memory_used_kb"),

    submittedAt: timestamp("submitted_at").notNull().defaultNow(),
    judgedAt: timestamp("judged_at"),

    createdByIp: varchar("created_by_ip", { length: 256 }),

    isPlagiarized: boolean("is_plagiarized").notNull().default(false),
    plagiarismScore: integer("plagiarism_score"),
    plagiarismReferenceId: varchar("plagiarism_reference_id", { length: 256 }),
  },
  (table) => ({
    idx_author: index("idx_submissions_author").on(
      table.contestRegisterationId
    ),
    idx_status: index("idx_submissions_status").on(table.submissionStatus),
    idx_contest_problem: index("idx_submissions_contest_problem").on(
      table.contestId,
      table.problemId
    ),
    idx_submitted_at: index("idx_submissions_submitted_at").on(
      table.submittedAt
    ),

    idx_plagiarized: index("idx_submissions_plagiarized").on(
      table.isPlagiarized
    ),
  })
);
