import type { z } from 'zod/v4';
import {
  zJobsSchema,
  zJobStatusEnum,
  zJobTypeEnum,
  zScreeningTypeEnum,
} from './validators';

export type JobTypeT = z.infer<typeof zJobTypeEnum>;
export type JobStatusT = z.infer<typeof zJobStatusEnum>;
export type JobScreeningTypeT = z.infer<typeof zScreeningTypeEnum>;

export type JobSchemaT = z.infer<typeof zJobsSchema>;
