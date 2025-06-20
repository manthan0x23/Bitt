import type { OrganizationInviteSchema } from '@/lib/types/organization-invite';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetOrganizationInviteByIdCall = (id: string) => {
  return axios.get(`${Env.server_url}/api/admin/organization/invite/${id}`, {
    withCredentials: true,
  });
};

export type GetOrganizationInviteByIdCallResponseT = {
  message: string;
  data: OrganizationInviteSchema;
};
