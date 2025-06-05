import type { JobSchemaT } from '@/lib/types/jobs';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const getJobByIdCall = (jobId: string) => {
  return axios.get(`${Env.server_url}/api/admin/job/get/${jobId}`, {
    withCredentials: true,
  });
};

export type GetJobByIdResponseT = {
  message: string;
  data: JobSchemaT;
};
