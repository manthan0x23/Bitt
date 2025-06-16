import type { ContestSearchParamsT } from '@/lib/types/globals';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import {
  GetTestcasesCall,
  type GetTestcasesCallResponseT,
} from '../server-calls/get-testcases';
import type { ApiError } from '@/lib/error';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TestCaseCard } from './testcase-card';

export const ProblemTestcases = () => {
  const { stageId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  });
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  }) satisfies ContestSearchParamsT;

  const testcasesQuery = useQuery<GetTestcasesCallResponseT, ApiError>({
    queryKey: ['admin', 'testcases', 'all', stageId, 'problem', search.problem],
    queryFn: async () => (await GetTestcasesCall(stageId, search.problem)).data,
  });

  return (
    <div className="pl-5 w-full h-full space-y-6">
      <div className="space-y-1">
        <h2>Test Cases</h2>
        <p className="text-muted-foreground">
          Add or remove test cases for this problem.
        </p>
      </div>

      {testcasesQuery.isLoading && <Skeleton className="h-[400px] w-1/2" />}

      {testcasesQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>{testcasesQuery.error.message}</AlertTitle>
          <AlertDescription>
            {testcasesQuery.error.response?.data.error ||
              'An unexpected error occurred.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="w-full h-auto flex flex-col justify-center gap-4 ">
        {testcasesQuery.data &&
          testcasesQuery.data.data.map((tc, index) => (
            <TestCaseCard key={tc.id} index={index} testcase={tc} />
          ))}
      </div>
    </div>
  );
};
