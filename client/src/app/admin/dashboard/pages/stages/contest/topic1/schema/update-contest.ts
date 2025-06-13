import {
  zContestAccessEnum,
  zContestPublishStateEnum,
  zContestTypeEnum,
} from '@/lib/types/contests/validators';
import z from 'zod/v4';

export const zUpdateContestSchema = z
  .object({
    id: z.string().min(1, 'Contest ID is required for update'),

    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    instructions: z
      .string()
      .min(5, 'Instructions must be at least 5 characters'),

    stageId: z.string().min(1, 'Stage Id must be present'),

    startAt: z.string().min(1, 'Start At date must be provided'),
    endAt: z.string(),

    duration: z
      .number()
      .nonnegative()
      .min(30, 'Duration must be minimum 30 minutes'),

    contestType: zContestTypeEnum,
    accessibility: zContestAccessEnum,
    state: zContestPublishStateEnum,

    warnings: z.array(z.string()),
    noOfProblems: z
      .number()
      .nonnegative()
      .min(1, 'Number of Problems cannot be <1'),

    requiresVideoMonitoring: z.boolean(),
    requiresAudioMonitoring: z.boolean(),
    requiresAIMonitoring: z.boolean(),
    requiresScreenMonitoring: z.boolean(),
    availableForPractise: z.boolean(),
  })
  .check((ctx) => {
    if (!ctx.value.stageId) {
      ctx.issues.push({
        code: 'custom',
        message:
          'Either contest would be independent or must be linked with a stageId',
        input: ctx.value.stageId,
        path: ['stageId'],
      });
    }

    if (ctx.value.contestType == 'live') {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      const startAt = new Date(ctx.value.startAt);
      if (startAt < oneHourFromNow) {
        ctx.issues.push({
          code: 'custom',
          message: 'Contest must be scheduled at least 1 hour from now',
          input: ctx.value.startAt,
          path: ['startAt'],
        });
      }
    } else {
      if (ctx.value.endAt <= ctx.value.startAt) {
        ctx.issues.push({
          code: 'custom',
          message: 'End time must be after Start time',
          path: ['endAt'],
          input: ctx.value.endAt,
        });
      }

      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      const startAt = new Date(ctx.value.startAt);
      const endAt = new Date(ctx.value.endAt);
      if (startAt < oneHourFromNow) {
        ctx.issues.push({
          code: 'custom',
          message: 'Contest must be scheduled at least 1 hour from now',
          input: ctx.value.startAt,
          path: ['startAt'],
        });
      }

      if (!ctx.value.endAt) {
        ctx.issues.push({
          code: 'invalid_value',
          message: 'End date for the contest must be specified if its not live',
          input: ctx.value.endAt,
          values: ['not_null'],
          path: ['endAt'],
        });
      }

      const minDurationMs = (ctx.value.duration || 0) * 60 * 1000;
      if (endAt.getTime() - startAt.getTime() < minDurationMs) {
        ctx.issues.push({
          code: 'custom',
          message: `There must be at least ${ctx.value.duration} minutes between start and end times`,
          path: ['endAt'],
          input: ctx.value.endAt,
        });
      }
    }
  });

export type UpdateContestSchemaT = z.infer<typeof zUpdateContestSchema>;
