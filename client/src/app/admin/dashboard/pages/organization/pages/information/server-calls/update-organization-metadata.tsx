import type { OrganizationSchemaT } from '@/lib/types/organization';
import { Env } from '@/lib/utils';
import axios from 'axios';
import type { UpdateOrganizationSchemaT } from '../schema/update-organization-metdata-schema';

export const UpdateOrganizationCall = (body: UpdateOrganizationSchemaT) => {
  return axios.put(`${Env.server_url}/api/admin/organization/update`, body, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export type UpdateOrganizationCallResponseT = {
  message: string;
  data: OrganizationSchemaT | null;
};
