import type { JobSchemaT } from '@/lib/types/jobs';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const getAllOrganizationJobsCall = () => {
  return axios.get(`${Env.server_url}/api/admin/job/all`, {
    withCredentials: true,
  });
};

export type GetAllOrganizationJobsCallResponseT = {
  message: string;
  data: JobSchemaT[];
};
