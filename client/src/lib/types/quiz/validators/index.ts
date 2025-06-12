import { z } from 'zod/v4';

export const quizTypeEnum = z.enum([
  'live',
  'take-home',
  'practise',
  'upsolve',
]);
export const quizStatusEnum = z.enum(['draft', 'open', 'closed', 'archived']);
export const quizStateEnum = z.enum(['public', 'private', 'invite-only']);

export const quizSchema = z.object({
  id: z.string().max(256),
  title: z.string().max(255),
  description: z.string(),
  instructions: z.string(),

  stageId: z.string().max(255),

  startAt: z.coerce.date().optional(),
  duration: z.number().nonnegative(),
  endAt: z.coerce.date().optional(),

  noOfQuestions: z.number().nonnegative().min(2),

  quizType: quizTypeEnum,
  state: quizStatusEnum,
  accessibility: quizStateEnum,

  requiresVideoMonitoring: z.boolean(),
  requiresAudioMonitoring: z.boolean(),
  requiresAIMonitoring: z.boolean(),
  requiresScreenMonitoring: z.boolean(),
  availableForPractise: z.boolean(),

  tags: z.array(z.string()).default([]),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const quizProblemTypeEnum = z.enum([
  'multiple_choice',
  'multiple_select',
  'text',
]);
export const quizProblemDifficultyEnum = z.enum(['easy', 'medium', 'hard']);

export const quizProblemSchema = z.object({
  id: z.string().min(1),
  type: quizProblemTypeEnum,
  question: z.string().nullable(),
  questionIndex: z.number().int().nonnegative().min(1),
  quizId: z.string().min(1),
  choices: z.array(z.string()).nullable(),
  answer: z.union([z.number(), z.array(z.number())]).nullable(),
  textAnswer: z.string().nullable(),
  explanation: z.string(),
  points: z.number().int(),
  difficulty: quizProblemDifficultyEnum,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
