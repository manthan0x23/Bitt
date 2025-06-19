import type { OrganizationSchemaT } from '@/lib/types/organization';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetOrganizationCall = () => {
  return axios.get(`${Env.server_url}/api/admin/organization/my`, {
    withCredentials: true,
  });
};

export type GetOrganizationCallResponseT = {
  message: string;
  data: OrganizationSchemaT | null;
};
