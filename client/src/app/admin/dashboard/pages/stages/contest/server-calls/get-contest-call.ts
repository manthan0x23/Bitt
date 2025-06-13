import type { ContestSchemaT } from '@/lib/types/contests';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetContestCall = (stageId: string) => {
  return axios.get(`${Env.server_url}/api/admin/stages/contest/get/${stageId}`, {
    withCredentials: true,
  });
};

export type GetContestCallResponseT = {
  message: string;
  data: ContestSchemaT & { problemsCount: number };
  error?: string;
};
