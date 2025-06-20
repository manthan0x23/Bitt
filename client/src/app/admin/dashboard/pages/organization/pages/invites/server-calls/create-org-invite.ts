import type { OrganizationInviteSchema } from '@/lib/types/organization-invite';
import { Env } from '@/lib/utils';
import axios from 'axios';
import type { CreateOrganizationInviteSchemaT } from '../schema/create-invite-schema';

export const CreateOrganizationInviteCall = (
  payload: CreateOrganizationInviteSchemaT,
) => {
  return axios.post(
    `${Env.server_url}/api/admin/organization/invite/`,
    payload,
    {
      withCredentials: true,
    },
  );
};

export type CreateOrganizationInviteCallResponseT = {
  message: string;
  data: OrganizationInviteSchema;
};
