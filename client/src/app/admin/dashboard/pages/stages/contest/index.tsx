import { useParams, useSearch } from '@tanstack/react-router';
import { ContestTopic1 } from './topic1';
import { ContestTopic2 } from './topic2';
import { useQuery } from '@tanstack/react-query';
import {
  GetContestCall,
  type GetContestCallResponseT,
} from './server-calls/get-contest-call';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRef, useEffect } from 'react';
import type { AxiosError } from 'axios';
import { useSidebar } from '@/components/ui/sidebar';

export const ContestPannelAdmin = () => {
  const { stageId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  });
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  }) satisfies { topic: number };
  const { setOpen } = useSidebar();

  const hasShownToast = useRef(false);

  const contestQuery = useQuery<GetContestCallResponseT, AxiosError>({
    queryKey: ['admin', 'stages', 'contest', 'get', stageId],
    queryFn: async () => {
      const response = await GetContestCall(stageId);
      return response.data;
    },
    refetchOnMount: 'always',
    refetchOnReconnect: true,
  });

  useEffect(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (contestQuery.isSuccess && !hasShownToast.current) {
      toast.success(contestQuery.data.message, { richColors: true });
      hasShownToast.current = true;
    }
  }, [contestQuery.isSuccess, contestQuery.data]);

  if (contestQuery.isLoading) {
    return <Skeleton className="h-full w-full max-w-4xl mx-auto" />;
  }

  if (contestQuery.isError) {
    const errorMessage =
      JSON.stringify(contestQuery.error?.response?.data) ||
      contestQuery.error?.message ||
      'Something went wrong';

    toast.error(errorMessage, { richColors: true });
    return null;
  }

  return (
    <>
      {contestQuery.data &&
        (search.topic === 1 ? (
          <ContestTopic1 contest={contestQuery.data.data} />
        ) : (
          <ContestTopic2 contest={contestQuery.data.data} />
        ))}
    </>
  );
};
