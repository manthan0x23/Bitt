import type { OrganizationInviteSchema } from '@/lib/types/organization-invite';
import { Env } from '@/lib/utils';
import axios from 'axios';
import type { UpdateOrganizationInviteSchema } from '../schema/update-invite-schema';

export const UpdateOrganizationInviteCall = (
  payload: UpdateOrganizationInviteSchema
) => {
  return axios.put(`${Env.server_url}/api/admin/organization/invite/`, payload, {
    withCredentials: true,
  });
};

export type UpdateOrganizationInviteCallResponseT = {
  message: string;
  data: OrganizationInviteSchema;
};
