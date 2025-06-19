import type { AdminSchemaT } from '@/lib/types/admin/indxe';
import type { RoleSchemaT } from '@/lib/types/roles';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetOrganizationMembersCall = () => {
  return axios.get(`${Env.server_url}/api/admin/organization/members`, {
    withCredentials: true,
  });
};

export type GetOrganizationMembersCallResponseT = {
  message: string;
  data: (AdminSchemaT | { role: RoleSchemaT })[];
};
