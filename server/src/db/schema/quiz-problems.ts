import {
  pgTable,
  text,
  varchar,
  timestamp,
  json,
  integer,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { quizProblemTypeEnum, quizProblemDifficultyEnum } from "./enums";
export const quizProblems = pgTable("quiz_problems", {
  id: varchar("id", { length: 256 }).$defaultFn(shortId),

  type: quizProblemTypeEnum("type").default("multiple_choice").notNull(),

  question: text("question").notNull(),

  choices: json("choices").$type<string[]>().default([]),

  answer: json("answer").$type<string | string[]>().notNull(),

  explanation: text("explanation"),
  points: integer("points").default(4),

  difficulty: quizProblemDifficultyEnum("difficulty").default("medium"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
