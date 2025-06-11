import type { QuizSchemaT } from '@/lib/types/quiz';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetQuizCall = (stageId: string) => {
  return axios.get(`${Env.server_url}/api/admin/stages/quiz/get/${stageId}`, {
    withCredentials: true,
  });
};

export type GetQuizCallResponseT = {
  message: string;
  data: QuizSchemaT & { questionsCount: number };
  error?: string;
};
