import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import {
  getJobByIdCall,
  type GetJobByIdResponseT,
} from './server-calls/get-job-by-id';
import { toast } from 'sonner';
import { EditStagesForm } from './_components/create-contest-form';

export const EditJob = () => {
  const router = useRouter();
  const { jobId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/edit',
  });

  const query = useQuery({
    queryKey: ['admin', 'jobs', 'get', jobId, 'edit'],
    queryFn: () => getJobByIdCall(jobId),
    select: ({ data }: { data: GetJobByIdResponseT }) => data,
  });

  if (query.isFetched && query.error) {
    toast.error('You are not authorized to edit the Job', {
      onAutoClose() {
        router.navigate({
          to: '/admin/jobs',
        });
      },
    });
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Configure Hiring Stages</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Define how candidates will be evaluated for this role. Add one or more
          stages such as quizzes, coding tests, interviews, and more.
        </p>
      </div>

      {query.data && <EditStagesForm job={query.data.data} />}
    </div>
  );
};
