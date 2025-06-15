import {
  ContestProblemSections,
  type ContestSearchParamsT,
} from '@/lib/types/globals';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter, useSearch } from '@tanstack/react-router';
import {
  GetContestProblemsByIdCall,
  type GetContestProblemsByIdCallResponseT,
} from '../server-calls/get-contest-problem-by-id-call';
import type { ApiError } from '@/lib/error';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ProblemDescription } from './problem-description';
import { ProblemBuilder } from './problem-builder';

export const ProblemPage = () => {
  const router = useRouter();
  const { stageId, jobId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  });
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  }) satisfies ContestSearchParamsT;

  const problemQuery = useQuery<GetContestProblemsByIdCallResponseT, ApiError>({
    queryKey: [
      'admin',
      'stages',
      'contest',
      'problems',
      stageId,
      'get',
      search.problem,
    ],
    queryFn: async () => {
      const response = await GetContestProblemsByIdCall(
        stageId,
        search.problem,
      );
      return response.data;
    },
  });

  if (problemQuery.isLoading && !problemQuery.isPlaceholderData) {
    return <Skeleton className="h-full w-full" />;
  }

  if (problemQuery.isError) {
    toast.error(problemQuery.error.response?.data.error);
  }

  return (
    <div className="w-full h-full">
      <section className="h-[5%] w-full border-b rounded-t-lg flex  items-center justify-start ">
        <div className="w-[80%] h-full rounded-tl-lg flex  items-center justify-start ">
          {ContestProblemSections.map((section) => (
            <div
              onClick={() => {
                router.navigate({
                  to: `/admin/jobs/${jobId}/stages/${stageId}/contest/`,
                  search: {
                    ...search,
                    section: section.key,
                  },
                  resetScroll: true,
                });
              }}
              className={cn(
                'text-sm px-12 h-full font-normal flex items-center justify-center gap-2',
                'hover:bg-secondary cursor-pointer transition-all',
                search.section == section.key &&
                  'border-b-4 border-primary font-semibold',
              )}
            >
              <section.icon size={15} strokeWidth={2} />
              {section.label}
            </div>
          ))}
        </div>
      </section>
      <section className="w-full mx-auto flex-1 min-h-0">
        <div className="h-full max-h-[83vh] overflow-y-auto relative rounded-md px-4 py-2">
          {search.section === 'builder' && problemQuery.data && (
            <ProblemBuilder problem={problemQuery.data.data} />
          )}
          {search.section === 'description' && problemQuery.data && (
            <ProblemDescription problem={problemQuery.data.data} />
          )}
        </div>
      </section>
    </div>
  );
};
