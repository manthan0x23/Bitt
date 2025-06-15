import type { ContestProblemSchemaT } from '@/lib/types/contests';
import type { FieldError } from '@/lib/types/globals';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetContestProblemsByIdCall = (
  stageId: string,
  problemIndex: number,
) => {
  return axios.get(
    `${Env.server_url}/api/admin/stages/contest/problems/${stageId}/get/${problemIndex}`,
    {
      withCredentials: true,
    },
  );
};

export type GetContestProblemsByIdCallResponseT = {
  message: string;
  data: ContestProblemSchemaT & { warnings: FieldError[] };
  error?: string;
};
