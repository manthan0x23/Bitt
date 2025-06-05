// hooks/useVerifyAuthentication.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Env } from '@/lib/utils';
import { authStore } from '@/store/authStore';

const verifyAuthenticationCall = () =>
  axios
    .get(`${Env.server_url}/api/auth/verify`, {
      withCredentials: true,
    })
    .then((res) => res.data.data);

export const useVerifyAuthentication = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['api', 'auth', 'verify'],
    queryFn: verifyAuthenticationCall,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  authStore.setState(() => ({
    user: data || null,
    isLoading,
    isError,
  }));

  return { user: data, isLoading, isError };
};
