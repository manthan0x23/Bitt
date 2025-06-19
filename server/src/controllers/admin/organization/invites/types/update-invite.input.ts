import { z } from "zod";
import { zMinuteDateTime } from "../../../../../utils/integrations/date-time";
import { zOrganizationInviteTypeEnum } from "./create-invite.input";

export const zOrganizationInviteStatusEnum = z.enum([
  "active",
  "revoked",
  "expired",
]);

export const zUpdateOrganizationInviteInput = z.object({
  id: z.string().min(1),
  allowedOrigins: z.array(z.string()).nullable(),
  inviteType: zOrganizationInviteTypeEnum.nullable(),
  usageLimit: z.number().nullable(),
  endDate: zMinuteDateTime.nullable(),
  status: zOrganizationInviteStatusEnum.nullable(),
});
