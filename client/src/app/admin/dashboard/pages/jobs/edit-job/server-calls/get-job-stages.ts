import type { StageSchemaT } from '@/lib/types/stages';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const getStagesByJobId = (jobId: string) => {
  return axios.get(`${Env.server_url}/api/admin/stages/all/${jobId}`, {
    withCredentials: true,
  });
};

export type GetStagesByJobIdResponseT = {
  message: string;
  data: StageSchemaT[];
};
