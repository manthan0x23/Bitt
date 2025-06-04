import type { z } from 'zod/v4';
import { CreateJobFormSchema } from '../schemas';
import axios from 'axios';
import { Env } from '@/lib/utils';
import type { JobSchemaT } from '@/lib/types/jobs';

export const createJobCall = (body: z.infer<typeof CreateJobFormSchema>) => {
  return axios.post(`${Env.server_url}/api/admin/job/create`, body, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export type CreateJobResponse = {
  message: string;
  data: JobSchemaT;
};
