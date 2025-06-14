import { z } from 'zod/v4';
import type {
  zContestAccessEnum,
  zContestProblemDifficultyEnum,
  zContestProblemSchema,
  zContestPublishStateEnum,
  zContestSchema,
  zContestTypeEnum,
} from './validators';

export type ContestSchemaT = z.infer<typeof zContestSchema>;

export type ContestTypeT = z.infer<typeof zContestTypeEnum>;
export type ContestAccessT = z.infer<typeof zContestAccessEnum>;
export type ContestPublishStateT = z.infer<typeof zContestPublishStateEnum>;

export type ContestProblemSchemaT = z.infer<typeof zContestProblemSchema>;
export type ContestProblemDifficultyT = z.infer<
  typeof zContestProblemDifficultyEnum
>;
