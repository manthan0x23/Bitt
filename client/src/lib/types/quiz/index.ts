import type { z } from 'zod/v4';
import type {
  quizSchema,
  quizStateEnum,
  quizStatusEnum,
  quizTypeEnum,
} from './validators';

export type QuizSchemaT = z.infer<typeof quizSchema>;

export type QuizTypeT = z.infer<typeof quizTypeEnum>;
export type QuizStatusT = z.infer<typeof quizStatusEnum>;
export type QuizStateT = z.infer<typeof quizStateEnum>;
