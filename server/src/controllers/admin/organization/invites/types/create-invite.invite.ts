import { z } from "zod";
import {
  minutePrecisionDateTimeRegex,
  zMinuteDateTime,
} from "../../../../../utils/integrations/date-time";

export const zOrganizationInviteTypeEnum = z.enum(["strict", "open-for-all"]);

export const zCreateOrganizationInviteInput = z.object({
  allowedOrigins: z.array(z.string()).default([]),
  inviteType: zOrganizationInviteTypeEnum.default("strict"),
  roleId: z.string().min(1, "Role ID is required."),
  role: z.string().min(1, "Role is required"),
  usageLimit: z.number().default(10),
  endDate: zMinuteDateTime,
});
