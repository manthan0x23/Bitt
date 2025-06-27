import { z } from "zod/v4";
export const zOrganizationInviteTypeEnum = z.enum(["strict", "open-for-all"]);

export const zUpdateOrganizationInviteInput = z.object({
  id: z.string().min(1, "Invite ID is required for updation"),
  allowedOrigins: z.array(z.email()).default([]),
  inviteType: zOrganizationInviteTypeEnum.default("strict"),
  roleId: z.string().min(1, "Role Id is required"),
  usageLimit: z.number().default(10),
  endDate: z.string().optional(),
});
