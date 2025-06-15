import { Env } from '@/lib/utils';
import axios from 'axios';
import type { UpdateContestProblemSchemaT } from '../schema/update-contest-problem';
import type { ContestProblemSchemaT } from '@/lib/types/contests';
import type { FieldError } from '@/lib/types/globals';

export const UpdateContestProblemsCall = (
  body: UpdateContestProblemSchemaT,
) => {
  return axios.put(
    `${Env.server_url}/api/admin/stages/contest/problems/update`,
    body,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export type UpdateContestProblemsCallResponseT = {
  message: string;
  data: ContestProblemSchemaT & { warnings: FieldError[] };
  error?: string;
};
