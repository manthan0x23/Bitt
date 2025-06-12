import type { QuizProblemSchemaT } from '@/lib/types/quiz';
import { Env } from '@/lib/utils';
import axios from 'axios';
import type { z } from 'zod/v4';
import type { zUpdateProblemSchema } from '../schema/create-problem';

export const UpdateQuizProblemsCall = (
  body: z.infer<typeof zUpdateProblemSchema>,
) => {
  return axios.put(`${Env.server_url}/api/admin/stages/quiz/problem/`, body, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export type UpdateQuizProblemsCallResponseT = {
  message: string;
  data: QuizProblemSchemaT;
  error?: string;
};
