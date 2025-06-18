import { z } from "zod";
import {
  minutePrecisionDateTimeRegex,
  zMinuteDateTime,
} from "../../../../utils/integrations/date-time";
import { zAdminRolesEnum } from "../../../../utils/types/admin-roles";

export const zOrganizationInviteTypeEnum = z.enum(["strict", "open-for-all"]);

export const zCreateOrganizationInviteInput = z.object({
  allowedOrigins: z.array(z.string()).default([]),
  inviteType: zOrganizationInviteTypeEnum.default("strict"),
  role: zAdminRolesEnum,
  usageLimit: z.number().default(10),
  endDate: zMinuteDateTime,
});
