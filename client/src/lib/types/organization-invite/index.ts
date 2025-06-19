import type { z } from 'zod/v4';
import type {
  zOrganizationInviteSchema,
  zOrganizationInviteStatusEnum,
  zOrganizationInviteTypeEnum,
} from './validators';

export type OrganizationInviteType = z.infer<
  typeof zOrganizationInviteTypeEnum
>;
export type OrganizationInviteStatus = z.infer<
  typeof zOrganizationInviteStatusEnum
>;

export type OrganizationInviteSchema = z.infer<typeof zOrganizationInviteSchema>;
