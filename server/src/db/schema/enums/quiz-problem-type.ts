import { pgEnum } from "drizzle-orm/pg-core";

export const quizProblemTypeEnum = pgEnum("quiz_problem_type_enum", [
  "multiple_choice",
  "multiple_select",
  "text",
]);

export const quizProblemDifficultyEnum = pgEnum(
  "quiz_problem_difficulty_enum",
  ["easy", "medium", "hard"]
);
