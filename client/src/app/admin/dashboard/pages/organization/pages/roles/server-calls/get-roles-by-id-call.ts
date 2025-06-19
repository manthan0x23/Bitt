import type { RoleSchemaT } from '@/lib/types/roles';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetOrgRoleByIdCall = (roleId: string) => {
  return axios.get(`${Env.server_url}/api/admin/organization/roles/${roleId}`, {
    withCredentials: true,
  });
};

export type GetOrgRoleByIdCallResponseT = {
  message: string;
  data: RoleSchemaT;
};
