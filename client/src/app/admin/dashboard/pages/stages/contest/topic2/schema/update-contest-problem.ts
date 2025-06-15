import { zContestProblemDifficultyEnum } from '@/lib/types/contests/validators';
import { z } from 'zod/v4';

export const zUpdateContestProblemSchema = z.object({
  id: z.string().min(1, 'ID is required.'),
  problemIndex: z.number('Problem index is required.'),
  contestId: z.string().min(1, 'Contest ID is required.'),

  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  inputDescription: z.string().min(1, 'Input description is required.'),
  outputDescription: z.string().min(1, 'Output description is required.'),
  constraints: z.string().min(1, 'Constraints are required.'),

  hints: z.array(z.string().min(1, 'Hint cannot be empty')).min(0),

  tags: z.array(z.string()).min(1, 'At least one tag is required'),

  difficulty: zContestProblemDifficultyEnum,

  points: z.number().int().positive('Points must be a positive integer.'),

  timeLimitMs: z
    .number()
    .int()
    .nonnegative('Time Limit must be a positive integer.'),
  memoryLimitMb: z
    .number()
    .int()
    .nonnegative('Memory Limit must be a positive integer.'),

  partialMarks: z.boolean(),
});

export type UpdateContestProblemSchemaT = z.infer<
  typeof zUpdateContestProblemSchema
>;
