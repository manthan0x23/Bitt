import type { TestcasesSchemaT } from '@/lib/types/testcases';
import { Env } from '@/lib/utils';
import axios from 'axios';

export const GetTestcasesCall = (stageId: string, problemIndex: number) => {
  return axios.get(
    `${Env.server_url}/api/admin/testcases/all/${stageId}/problem/${problemIndex}`,
    {
      withCredentials: true,
    },
  );
};

export type GetTestcasesCallResponseT = {
  message: string;
  data: TestcasesSchemaT[];
  error?: string;
};
