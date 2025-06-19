import type { OrganizationInviteSchema } from '@/lib/types/organization-invite';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetOrganizationInvitesCall = () => {
  return axios.get(`${Env.server_url}/api/admin/organization/invite/`, {
    withCredentials: true,
  });
};

export type GetOrganizationInvitesCallResponseT = {
  message: string;
  data: OrganizationInviteSchema[];
};
