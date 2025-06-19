import { colorSchemeEnum } from '@/integrations/theme/colors/scheme';
import { zCapabilityEnum } from '@/lib/types/capabilities';
import { z } from 'zod/v4';

export const zUpdateRoleSchema = z.object({
  id: z.string().min(1), // Required for identifying the role
  tag: z.string().min(1).max(64).optional(),
  capabilities: z.array(zCapabilityEnum).optional(),
  colorScheme: colorSchemeEnum.optional(),
  isTemplate: z.boolean().optional().default(false),
});

export type UpdateRoleSchemaT = z.infer<typeof zUpdateRoleSchema>;
