import type { ContestSchemaT } from '@/lib/types/contests';
import { Env } from '@/lib/utils';
import axios from 'axios';
import type { UpdateContestSchemaT } from '../schema/update-contest';

export const UpdateContestCall = (body: UpdateContestSchemaT) => {
  return axios.put(`${Env.server_url}/api/admin/stages/contest/update`, body, {
    withCredentials: true,
  });
};

export type UpdateContestCallResponseT = {
  message: string;
  data: ContestSchemaT;
  error?: string;
};
