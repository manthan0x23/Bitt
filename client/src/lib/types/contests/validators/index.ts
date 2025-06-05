import { z } from 'zod/v4';

export const zContestTypeEnum = z.enum(['live', 'practice']); // extend if more
export const zContestAccessEnum = z.enum(['public', 'private']);
export const zContestPublishStateEnum = z.enum([
  'draft',
  'published',
  'archived',
]);
export const zContestSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),

  stage: z.number().int().nonnegative().default(1),

  jobId: z.string().min(1),

  startAt: z.iso.datetime({ message: 'Invalid start datetime' }),
  endAt: z.iso.datetime({ message: 'Invalid end datetime' }),

  duration: z.number().nonnegative().default(10),

  contestType: zContestTypeEnum.default('live'),
  accessibility: zContestAccessEnum.default('public'),

  availableForPractise: z.boolean().default(true),

  publishState: zContestPublishStateEnum,

  createdAt: z.string().datetime().optional(),
});
