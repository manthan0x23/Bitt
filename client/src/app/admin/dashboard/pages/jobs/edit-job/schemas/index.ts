import {
  zStageSelectionCriteria,
  zStageSelectType,
  zStageTypeEnum,
} from '@/lib/types/stages/validators';
import { z } from 'zod/v4';

export const CreateStageSchema = z
  .object({
    jobId: z.string().min(1, 'Job Id is required'),

    stageIndex: z.number(),

    type: zStageTypeEnum.default('contest'),

    inflow: z.number(),
    outflow: z.number(),

    description: z
      .string()
      .min(10)
      .max(1000, 'Description cannot be greater than 1000 character'),

    selectionCriteria: zStageSelectionCriteria.default('automatic').optional(),
    selectType: zStageSelectType.default('relax').optional(),

    startAt: z.iso.datetime().optional().nullable(),
    endAt: z.iso.datetime().optional().nullable(),
  })
  .check((ctx) => {
    const { inflow, outflow, type, startAt, endAt } = ctx.value;

    if (outflow > inflow) {
      ctx.issues.push({
        code: 'custom',
        message: 'Outflow must be less than or equal to Inflow',
        path: ['outflow'],
        input: outflow,
      });
    }

    // Only validate time fields if type !== 'resume_filter'
    // if (type !== 'resume_filter') {
    //   if (!startAt || !endAt) {
    //     ctx.issues.push({
    //       code: 'custom',
    //       message: 'Start and End time are required for this stage type',
    //       path: ['startAt'],
    //       input: startAt,
    //     });
    //     return; // stop further checks if they're missing
    //   }

    //   if (endAt <= startAt) {
    //     ctx.issues.push({
    //       code: 'custom',
    //       message: 'End time must be after Start time',
    //       path: ['endAt'],
    //       input: endAt,
    //     });
    //   }
    // }
  });

export type CreateStageSchemaT = z.infer<typeof CreateStageSchema>;
