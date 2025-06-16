import { z } from 'zod/v4';

export const zTestcasesTypeEnum = z.enum(['example', 'system', 'hidden']);

export const zTestcaseSchema = z.object({
  id: z.string().max(256),
  contestProblemId: z.string().max(256),
  input: z.string().min(1),
  output: z.string().min(1),
  type: zTestcasesTypeEnum.default('system'),
  points: z.number().nonnegative().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
