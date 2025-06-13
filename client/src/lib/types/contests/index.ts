import { z } from 'zod/v4';
import type {
  zContestAccessEnum,
  zContestPublishStateEnum,
  zContestSchema,
  zContestTypeEnum,
} from './validators';

export type ContestSchemaT = z.infer<typeof zContestSchema>;

export type ContestTypeT = z.infer<typeof zContestTypeEnum>;
export type ContestAccessT = z.infer<typeof zContestAccessEnum>;
export type contestPublishStateT = z.infer<typeof zContestPublishStateEnum>;
