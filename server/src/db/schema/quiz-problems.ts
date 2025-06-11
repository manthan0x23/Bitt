import {
  pgTable,
  text,
  varchar,
  timestamp,
  json,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { quizProblemTypeEnum, quizProblemDifficultyEnum } from "./enums";
import { quizes } from "./quiz";

export const quizProblems = pgTable(
  "quiz_problems",
  {
    id: varchar("id", { length: 256 })
      .$defaultFn(shortId)
      .primaryKey()
      .unique()
      .notNull(),

    type: quizProblemTypeEnum("type").default("multiple_choice").notNull(),

    question: text("question").notNull(),

    quizId: varchar("quizId", { length: 256 })
      .references(() => quizes.id)
      .notNull(),

    choices: json("choices").$type<string[]>().default([]),

    answer: json("answer").$type<number | number[]>().notNull(),

    explanation: text("explanation"),
    points: integer("points").default(4),

    difficulty: quizProblemDifficultyEnum("difficulty").default("medium"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    quizIdProblemidx: index("quiz_id_problem_idx").on(table.quizId),
  })
);
