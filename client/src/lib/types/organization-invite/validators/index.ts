import { z } from 'zod/v4';

export const zOrganizationInviteTypeEnum = z.enum(['open-for-all', 'strict']);

export const zOrganizationInviteStatusEnum = z.enum([
  'active',
  'closed',
  'expired',
  'limit_reached',
  'deleted',
]);

export const zOrganizationInviteSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1).max(64),

  organizationId: z.string().min(1),
  roleId: z.string().nullable(),

  allowedOrigins: z.array(z.string().max(512)),

  inviteType: zOrganizationInviteTypeEnum,
  usageLimit: z.number().int().nonnegative(),
  usageCount: z.number().int().nonnegative(),

  createdBy: z.string().min(1),
  status: zOrganizationInviteStatusEnum,

  endDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable(),
});
