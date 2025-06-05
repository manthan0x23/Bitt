import { z } from 'zod/v4';
import type {
  zStageSchema,
  zStageSelectType,
  zStageSelectionCriteria,
  zStageTypeEnum,
} from './validators';

export type StageSchemaT = z.infer<typeof zStageSchema>;

export type StageSelectTypeEnumT = z.infer<typeof zStageSelectType>;

export type StageSelectionCriteriaEnumT = z.infer<
  typeof zStageSelectionCriteria
>;

export type StageTypeEnumT = z.infer<typeof zStageTypeEnum>;
