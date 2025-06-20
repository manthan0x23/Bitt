import { colorSchemeEnum } from '@/integrations/theme/colors/scheme';
import { zCapabilityEnum } from '@/lib/types/capabilities';
import { z } from 'zod/v4';

export const zCreateRoleSchema = z.object({
  tag: z.string().min(1, 'Role needs a tag').max(64),
  capabilities: z
    .array(zCapabilityEnum)
    .min(1, 'At least 1 capability needs to be assigned to a role'),
  colorScheme: colorSchemeEnum,
  isTemplate: z.boolean(),
});

export type CreateRoleSchemaT = z.infer<typeof zCreateRoleSchema>;
