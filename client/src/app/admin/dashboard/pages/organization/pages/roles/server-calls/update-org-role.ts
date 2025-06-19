import type { RoleSchemaT } from '@/lib/types/roles';
import { Env } from '@/lib/utils';
import axios from 'axios';
import type { UpdateRoleSchemaT } from '../schemas/update-role-schema';

export const UpdateOrgRoleCall = (body: UpdateRoleSchemaT) => {
  return axios.put(`${Env.server_url}/api/admin/organization/roles`, body, {
    withCredentials: true,
  });
};

export type UpdateOrgRoleCallResponseT = {
  message: string;
  data: RoleSchemaT;
};
