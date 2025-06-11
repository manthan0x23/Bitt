import { Env } from '@/lib/utils';
import axios from 'axios';

export const GenerateQuizCall = (stageId: string) => {
  return axios.put(
    `${Env.server_url}/api/admin/stages/quiz/generate/${stageId}`,
    {},
    {
      withCredentials: true,
    },
  );
};

export type GenerateQuizCallResponseT = {
  message: string;
  data: number;
  error?: string;
};
