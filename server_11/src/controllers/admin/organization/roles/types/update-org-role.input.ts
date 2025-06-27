import { z } from "zod/v4";
import { zCapabilityEnum } from "../../../../../utils/types/admin-capabilities";
import { colorSchemeEnum } from "../../../../../utils/types/default-roles-org";

export const zUpdateRoleInput = z.object({
  id: z.string().min(1), // Required for identifying the role
  tag: z.string().min(1).max(64).optional(),
  capabilities: z.array(zCapabilityEnum).optional(),
  colorScheme: colorSchemeEnum.optional(),
  isTemplate: z.boolean().optional().default(false),
});
