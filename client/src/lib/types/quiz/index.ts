import type { z } from 'zod/v4';
import type {
  quizProblemDifficultyEnum,
  quizProblemSchema,
  quizProblemTypeEnum,
  quizSchema,
  quizStateEnum,
  quizStatusEnum,
  quizTypeEnum,
} from './validators';

export type QuizSchemaT = z.infer<typeof quizSchema>;
export type QuizTypeT = z.infer<typeof quizTypeEnum>;
export type QuizStatusT = z.infer<typeof quizStatusEnum>;
export type QuizStateT = z.infer<typeof quizStateEnum>;

export type QuizProblemSchemaT = z.infer<typeof quizProblemSchema>;
export type QuizProblemTypeT = z.infer<typeof quizProblemTypeEnum>;
export type QuizProblemDifficultyT = z.infer<typeof quizProblemDifficultyEnum>;
