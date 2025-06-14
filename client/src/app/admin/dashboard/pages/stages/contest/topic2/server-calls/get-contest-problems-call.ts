import type { ContestProblemSchemaT } from '@/lib/types/contests';
import type { FieldError } from '@/lib/types/globals';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetContestProblemsCall = (stageId: string) => {
  return axios.get(
    `${Env.server_url}/api/admin/stages/contest/problems/${stageId}`,
    {
      withCredentials: true,
    },
  );
};

export type GetContestProblemsCallResponseT = {
  message: string;
  data: (ContestProblemSchemaT & { warnings: FieldError[] })[] | null;
  error?: string;
};
