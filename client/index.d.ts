// types/axios-error.d.ts
import 'axios';

declare module 'axios' {
  export interface AxiosResponse<T = any> {
    data: T;
  }

  export interface AxiosError<T = { error?: string }> {
    response?: AxiosResponse<T>;
  }
}
