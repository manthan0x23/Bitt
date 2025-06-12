import { Env } from '@/lib/utils';
import axios from 'axios';

export const CreateQuizProblemCall = (quizId: string) => {
  return axios.post(
    `${Env.server_url}/api/admin/stages/quiz/problem/${quizId}`,
    {},
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export type CreateQuizProblemCallResponseT = {
  message: string;
  data: number;
  error?: string;
};
