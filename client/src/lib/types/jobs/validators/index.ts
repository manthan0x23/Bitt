import { z } from 'zod/v4';

export const zJobTypeEnum = z.enum(['internship', 'full-time', 'part-time']);
export const zJobStatusEnum = z.enum(['draft', 'open', 'closed', 'archived']);
export const zScreeningTypeEnum = z.enum([
  'application',
  'single-stage',
  'multi-stage',
]);
