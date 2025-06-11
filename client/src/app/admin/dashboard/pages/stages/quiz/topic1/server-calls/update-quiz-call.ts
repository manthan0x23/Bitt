import axios from 'axios';
import type { UpdateQuizSchemaT } from '../schema/update-quiz-input';
import { Env } from '@/lib/utils';
import type { QuizSchemaT } from '@/lib/types/quiz';

export const UpdateQuizCall = (data: UpdateQuizSchemaT) => {
  return axios.post(`${Env.server_url}/api/admin/stages/quiz/update`, data, {
    withCredentials: true,
  });
};

export type UpdateQuizCallResponseT = {
  message: string;
  data: QuizSchemaT;
};
