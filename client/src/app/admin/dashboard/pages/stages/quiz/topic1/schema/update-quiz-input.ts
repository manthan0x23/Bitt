import {
  quizStateEnum,
  quizStatusEnum,
  quizTypeEnum,
} from '@/lib/types/quiz/validators';
import { z } from 'zod/v4';

export const UpdateQuizSchema = z.object({
  title: z.string().min(4, 'Minimum title length required is 4').max(255),

  stageId: z.string(),

  description: z.string().min(1, 'Description required'),
  instructions: z.string().min(1, 'Instructions required'),

  startAt: z.string(),
  endAt: z.string(),
  duration: z.number().nonnegative(),

  quizType: quizTypeEnum,
  state: quizStatusEnum,
  accessibility: quizStateEnum,

  noOfQuestions: z.number().nonnegative().min(2),
  tags: z.array(z.string()),

  requiresVideoMonitoring: z.boolean(),
  requiresAudioMonitoring: z.boolean(),
  requiresAIMonitoring: z.boolean(),
  requiresScreenMonitoring: z.boolean(),
  availableForPractise: z.boolean(),
});

export type UpdateQuizSchemaT = z.infer<typeof UpdateQuizSchema>;
