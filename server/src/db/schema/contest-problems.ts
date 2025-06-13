import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  index,
  decimal,
  boolean,
  unique,
  json,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { admins } from "./admins";
import { contests } from "./contests";
import { quizes } from "./quiz";

export const contestProblems = pgTable(
  "contest_problems",
  {
    id: varchar("id", { length: 256 })
      .primaryKey()
      .notNull()
      .$defaultFn(shortId),

    title: varchar("title", { length: 256 }).notNull(),
    description: text("description").notNull(),

    problemIndex: integer("problem_index").notNull(),

    solution: text("solution"),

    inputDescription: text("input_description"),
    outputDescription: text("output_description"),
    constraints: text("constraints"),

    hint: text("hint"),

    sampleInput: text("sample_input"),
    sampleOutput: text("sample_output"),

    points: integer("points").notNull().default(100),
    difficulty: decimal("difficulty").notNull().default("1.0"),

    timeLimitMs: integer("time_limit_ms").notNull().default(1000),
    memoryLimitMb: integer("memory_limit_mb").notNull().default(256),

    noOfProblems: integer("number_of_problems").default(1),

    authorId: varchar("author_id").references(() => admins.id, {
      onDelete: "set null",
    }),

    contestId: varchar("contest_id")
      .references(() => contests.id)
      .notNull(),

    tags: json("tags").$type<number | number[]>(),

    partialMarks: boolean("partial_marks").default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    titleIndex: index("problems_title_idx").on(table.title),
    authorIdIndex: index("problems_author_id_idx").on(table.authorId),
    difficultyIndex: index("problems_difficulty_idx").on(table.difficulty),
    contestIdIndex: index("problems_contest_id_idx").on(table.contestId),
    pointsIndex: index("problems_points_idx").on(table.points),
    createdAtIndex: index("problems_created_at_idx").on(table.createdAt),
    problemContestIdx: unique("problem_contest_unqiue_index_idx").on(
      table.problemIndex,
      table.contestId
    ),
  })
);
