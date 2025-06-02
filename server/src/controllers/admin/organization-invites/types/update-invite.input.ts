import { z } from "zod";
import { zMinuteDateTime } from "../../../../utils/integrations/date-time";

export const zOrganizationInviteStatusEnum = z.enum([
  "active",
  "revoked",
  "expired",
]);
export const zOrganizationInviteTypeEnum = z.enum(["strict", "open-for-all"]);

export const zUpdateOrganizationInviteInput = z.object({
  id: z.string().min(1),
  allowedOrigins: z.array(z.string()).optional(),
  inviteType: zOrganizationInviteTypeEnum.optional(),
  usageLimit: z.number().optional(),
  endDate: zMinuteDateTime.optional(),
  status: zOrganizationInviteStatusEnum.optional(),
});
