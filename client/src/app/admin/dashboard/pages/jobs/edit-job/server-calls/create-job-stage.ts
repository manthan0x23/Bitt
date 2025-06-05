import type { CreateStageSchemaT } from '../schemas';
import axios from 'axios';
import { Env } from '@/lib/utils';
import type { StageSchemaT } from '@/lib/types/stages';

export const createJobStageCall = (body: CreateStageSchemaT) => {
  return axios.post(`${Env.server_url}/api/admin/stages/create`, body, {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  });
};

export type CreateJobStageResponseT = {
  message: string;
  data: StageSchemaT;
};
