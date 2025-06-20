import { zOrganizationInviteTypeEnum } from '@/lib/types/organization-invite/validators';
import { z } from 'zod/v4';

export const zUpdateOrganizationInviteSchema = z
  .object({
    id: z.string().min(1, 'Invite ID is required for updation'),
    allowedOrigins: z.array(z.email()),
    inviteType: zOrganizationInviteTypeEnum.default('strict'),
    roleId: z.string().min(1, 'Role Id is required'),
    usageLimit: z.number(),
    endDate: z.string().nullable(),
  })
  .check(({ value, issues }) => {
    if (value.inviteType === 'strict' && value.allowedOrigins.length == 0) {
      issues.push({
        input: value.allowedOrigins,
        code: 'invalid_value',
        values: [],
        message: 'At least one allowed origin is required for strict invites',
        path: ['allowedOrigins'],
      });
    }
  });

export type UpdateOrganizationInviteSchema = z.infer<
  typeof zUpdateOrganizationInviteSchema
>;
