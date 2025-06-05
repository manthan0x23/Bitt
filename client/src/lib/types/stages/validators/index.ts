import { z } from 'zod/v4';

export const zStageTypeEnum = z.enum([
  'contest',
  'interview',
  'resume_filter',
  'mcq_test',
]);
export const zStageSelectionCriteria = z.enum(['automatic', 'manual']);
export const zStageSelectType = z.enum(['relax', 'strict']);

export const zStageSchema = z.object({
  id: z.string().max(256).optional(),

  stageIndex: z.number().int().min(1).optional().default(1),

  type: zStageTypeEnum.default('contest'),

  description: z.string(),

  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),

  inflow: z.number().int().optional().default(2000),
  outflow: z.number().int().optional().default(100),

  selectionCriteria: zStageSelectionCriteria.default('automatic'),

  selectType: zStageSelectType.default('relax'),
  isFinal: z.boolean().optional().default(false),

  startAt: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),

  endAt: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),

  jobId: z.string().max(256),
});
