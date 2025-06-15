import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils'; // Make sure this is your classnames utility
import { useRouter, useSearch, useParams } from '@tanstack/react-router';
import type { GetContestProblemsCallResponseT } from '../server-calls/get-contest-problems-call';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateContestProblemsCall,
  type CreateContestProblemsCallResponseT,
} from '../server-calls/create-contest-problem-call';
import { toast } from 'sonner';
import type { ApiError } from '@/lib/error';
import type { ContestSearchParamsT } from '@/lib/types/globals';

type Props = {
  totalProblemCount: number;
  problems: GetContestProblemsCallResponseT['data'] | undefined;
  isError: boolean;
  isLoading: boolean;
};

export const ProblemsCard = ({
  problems,
  isError,
  isLoading,
  totalProblemCount,
}: Props) => {
  const router = useRouter();
  const queries = useQueryClient();
  const { stageId, jobId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  });

  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  }) satisfies ContestSearchParamsT;

  const createProblemMutation = useMutation<
    CreateContestProblemsCallResponseT,
    ApiError
  >({
    mutationFn: async () => (await CreateContestProblemsCall(stageId)).data,
    onMutate: () => {
      toast.loading('Creating Problem....', {
        id: 'create-contest-problems',
      });
    },
    onSuccess: ({ data: newProblemIndex, message }) => {
      toast.success(message, {
        id: 'create-contest-problems',
      });
      queries.invalidateQueries({
        queryKey: ['admin', 'stages', 'contest', 'problems', stageId],
      });
      handleNavigate(newProblemIndex);
    },
    onError: (e) => {
      toast.error(e.response?.data.error, {
        id: 'create-contest-problems',
      });
    },
  });

  const handleNavigate = (index: number) => {
    router.navigate({
      to: `/admin/jobs/${jobId}/stages/${stageId}/contest/`,
      search: { topic: 2, problem: index, section: 'builder' },
      resetScroll: true,
    });
  };
  const isComplete = (problems?.length ?? 0) == totalProblemCount;

  if (isLoading) return <Skeleton className="h-full w-full" />;
  if (isError)
    return (
      <Card className="text-destructive p-4">Error in loading problems</Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Problems</CardTitle>
        <CardDescription>
          {problems?.length === 1
            ? '1 problem in this contest'
            : `${problems?.length || 0} problems in this contest`}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div className="h-auto pr-2">
          <div className="flex flex-wrap gap-2 py-2 pl-1">
            {problems?.map((problem) => {
              const isActive = search.problem === problem.problemIndex;
              return (
                <div
                  title={
                    problem.warnings.length > 0
                      ? `Resolve issues with problem ${problem.problemIndex}`
                      : `Problem ${problem.problemIndex}`
                  }
                  key={problem.id}
                  className={cn(
                    'group relative cursor-pointer flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shadow-sm transition-all duration-150',
                    'hover:ring hover:ring-accent font-semibold',
                    isActive
                      ? 'bg-primary border text-primary-foreground'
                      : 'bg-muted border',
                  )}
                  onClick={() => handleNavigate(problem.problemIndex)}
                >
                  {problem.warnings.length > 0 && (
                    <div
                      className={cn(
                        'absolute h-2 w-2 rounded-full bg-destructive transition-transform duration-150',
                        '-top-[0.9px] -right-[0.9px]',
                        'group-hover:translate-x-[1px] group-hover:-translate-y-[1px]',
                      )}
                    />
                  )}
                  {problem.problemIndex}
                </div>
              );
            })}
            {!isComplete && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  createProblemMutation.mutate();
                }}
                className={cn(
                  'rounded-full h-8 w-8 p-0 shadow-sm cursor-pointer text-primary-foreground',
                  'hover:ring-2 hover:ring-primary hover:bg-primary',
                )}
                variant="secondary"
                title="Add a new problem"
              >
                <PlusCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground space-y-2">
        {problems?.length === 0 ? (
          <span>No problems added to this contest yet.</span>
        ) : (
          <span>
            You’ve added{' '}
            <span className="font-semibold">
              {problems?.length || 0} / {totalProblemCount}
            </span>{' '}
            problems.
          </span>
        )}
      </CardFooter>
    </Card>
  );
};
