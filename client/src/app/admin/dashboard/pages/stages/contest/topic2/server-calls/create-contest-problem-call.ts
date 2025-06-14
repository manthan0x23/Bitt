import { Env } from '@/lib/utils';
import axios from 'axios';

export const CreateContestProblemsCall = (stageId: string) => {
  return axios.post(
    `${Env.server_url}/api/admin/stages/contest/problems/create/${stageId}`,
    {},
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export type CreateContestProblemsCallResponseT = {
  message: string;
  data: number;
  error?: string;
};
