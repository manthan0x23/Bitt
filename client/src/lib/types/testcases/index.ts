import type { z } from 'zod/v4';
import type { zTestcaseSchema, zTestcasesTypeEnum } from './validators';

export type TestcasesTypeT = z.infer<typeof zTestcasesTypeEnum>;
export type TestcasesSchemaT = z.infer<typeof zTestcaseSchema>;
