import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { JobsTable } from './jobs-table';
import {
  getAllOrganizationJobsCall,
  type GetAllOrganizationJobsCallResponseT,
} from '../server-calls/get-all-organization-jobs';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

export const JobsTableShell = () => {
  const hasShownToast = useRef(false);

  const jobsQuery = useQuery({
    queryKey: ['admin', 'jobs', 'all'],
    queryFn: getAllOrganizationJobsCall,
    select: ({ data }: { data: GetAllOrganizationJobsCallResponseT }) => {
      return data;
    },
  });

  useEffect(() => {
    if (jobsQuery.isSuccess && !hasShownToast.current) {
      toast.success(jobsQuery.data?.message);
      hasShownToast.current = true;
    }
  }, [jobsQuery.isSuccess, jobsQuery.data]);

  if (jobsQuery.isLoading) {
    return <Skeleton className="h-[70vh] w-full" />;
  }

  return <JobsTable data={jobsQuery.data?.data ?? []} />;
};
