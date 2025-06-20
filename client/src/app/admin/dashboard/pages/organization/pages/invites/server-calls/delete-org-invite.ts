import { Env } from '@/lib/utils';
import axios from 'axios';

export const DeleteOrganizationInviteCall = (id: string) => {
  return axios.delete(`${Env.server_url}/api/admin/organization/invite/${id}`, {
    withCredentials: true,
  });
};

export type DeleteOrganizationInviteCallResponseT = {
  message: string;
};
