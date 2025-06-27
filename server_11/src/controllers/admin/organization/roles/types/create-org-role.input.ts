import { z } from "zod/v4";
import { zCapabilityEnum } from "../../../../../utils/types/admin-capabilities";
import { colorSchemeEnum } from "../../../../../utils/types/default-roles-org";

export const zCreateRoleInput = z.object({
  tag: z.string().min(1).max(64),
  capabilities: z.array(zCapabilityEnum).default([]),
  colorScheme: colorSchemeEnum.default("gray"),
  isTemplate: z.boolean().default(false),
});
