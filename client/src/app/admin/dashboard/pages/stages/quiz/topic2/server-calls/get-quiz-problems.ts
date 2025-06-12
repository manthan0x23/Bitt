import type { QuizProblemSchemaT } from '@/lib/types/quiz';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetQuizProblemsCall = (stageId: string) => {
  return axios.get(
    `${Env.server_url}/api/admin/stages/quiz/problems/${stageId}`,
    {
      withCredentials: true,
    },
  );
};

export type GetQuizProblemsCallResponseT = {
  message: string;
  data: QuizProblemSchemaT[];
  error?: string;
};
