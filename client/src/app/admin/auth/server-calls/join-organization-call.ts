import { Env } from '@/lib/utils';
import axios from 'axios';

export type JoinOrgBody = {
  link?: string;
  code?: string;
};

export const JoinOrganizationCall = (body: JoinOrgBody) => {
  return axios.post(`${Env.server_url}/api/admin/organization/join`, body, {
    withCredentials: true,
  });
};

export type JoinOrganizationCallResponseT = {
  message: string;
};
