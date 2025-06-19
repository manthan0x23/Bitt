import type { RoleSchemaT } from '@/lib/types/roles';
import { Env } from '@/lib/utils';
import axios from 'axios';
import type { CreateRoleSchemaT } from '../schemas/create-role-schema';

export const CreateOrgRoleCall = (body: CreateRoleSchemaT) => {
  return axios.post(`${Env.server_url}/api/admin/organization/roles`, body, {
    withCredentials: true,
  });
};

export type CreateOrgRoleCallResponseT = {
  message: string;
  data: RoleSchemaT;
};
