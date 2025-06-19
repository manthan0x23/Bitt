import type { RoleSchemaT } from '@/lib/types/roles';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetOrgRolesCall = () => {
  return axios.get(`${Env.server_url}/api/admin/organization/roles`, {
    withCredentials: true,
  });
};

export type GetOrgRolesCallResponseT = {
  message: string;
  data: RoleSchemaT[];
};
