import { z } from 'zod/v4';

export const zContestTypeEnum = z.enum(['live', 'assignment', 'practise']);

export const zContestAccessEnum = z.enum(['public', 'private', 'invite-only']);

export const zContestPublishStateEnum = z.enum([
  'draft',
  'open',
  'closed',
  'archived',
]);

export const zContestSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(256),
  description: z.string().optional(),
  instructions: z.string().optional(),

  stageId: z.string().min(1).nullable(),
  isIndependent: z.boolean().default(false),

  startAt: z.coerce.date(),
  endAt: z.coerce.date().nullable(),
  duration: z.number().int().nonnegative().default(0),

  contestType: zContestTypeEnum.default('live'),
  accessibility: zContestAccessEnum.default('public'),

  requiresVideoMonitoring: z.boolean().default(false),
  requiresAudioMonitoring: z.boolean().default(false),
  requiresAIMonitoring: z.boolean().default(false),
  requiresScreenMonitoring: z.boolean().default(false),

  availableForPractise: z.boolean().default(false),

  state: zContestPublishStateEnum,
  noOfProblems: z.number().int().positive().default(1),

  warnings: z.array(z.string()).default([]),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const zContestProblemDifficultyEnum = z.enum(['easy', 'medium', 'hard']);

export const zContestProblemSchema = z.object({
  id: z.string().max(256).nullable(),
  title: z.string().max(256),
  description: z.string(),

  problemIndex: z.number().int().nonnegative(),

  inputDescription: z.string().nullable(),
  outputDescription: z.string().nullable(),
  constraints: z.string().nullable(),

  hints: z.array(z.string()).nullable(),

  points: z.number().int().default(100),

  difficulty: zContestProblemDifficultyEnum.default('medium'),

  timeLimitMs: z.number().int().default(1000),
  memoryLimitMb: z.number().int().default(256),

  authorIds: z.array(z.string()),

  contestId: z.string(),

  tags: z.array(z.string()).nullable(),

  partialMarks: z.boolean().default(true),

  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  deletedAt: z.date().nullable().nullable(),
});
