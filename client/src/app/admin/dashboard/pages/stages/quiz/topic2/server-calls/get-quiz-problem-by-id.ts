import type { QuizProblemSchemaT } from '@/lib/types/quiz';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetQuizProblemByIdCall = (
  questionIndex: number,
  stageId: string,
) => {
  return axios.get(
    `${Env.server_url}/api/admin/stages/quiz/problem/${questionIndex}/stage/${stageId}`,
    {
      withCredentials: true,
    },
  );
};

export type GetQuizProblemByIdCallResponseT = {
  message: string;
  data: QuizProblemSchemaT | null;
  error?: string;
};
