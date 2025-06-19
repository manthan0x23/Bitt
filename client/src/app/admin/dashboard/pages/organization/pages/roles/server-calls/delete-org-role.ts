import type { RoleSchemaT } from '@/lib/types/roles';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const DeleteOrgRoleCall = (roleId: string) => {
  return axios.delete(
    `${Env.server_url}/api/admin/organization/roles/${roleId}`,
    {
      withCredentials: true,
    },
  );
};

export type DeleteOrgRoleCallResponseT = {
  message: string;
  data: RoleSchemaT;
};
