import type { ContestSchemaT } from '@/lib/types/contests';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter, useSearch } from '@tanstack/react-router';
import type { AxiosError } from 'axios';
import {
  GetContestProblemsCall,
  type GetContestProblemsCallResponseT,
} from '../server-calls/get-contest-problems-call';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { ProblemsCard } from './problems-card';
import type { ContestSearchParamsT } from '@/lib/types/globals';

type Props = {
  contest: ContestSchemaT;
};

export const SidePannel = ({ contest }: Props) => {
  const router = useRouter();
  const { stageId, jobId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  });
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  }) satisfies ContestSearchParamsT;

  const problemsQuery = useQuery<GetContestProblemsCallResponseT, AxiosError>({
    queryKey: ['admin', 'stages', 'contest', 'problems', stageId],
    queryFn: async () => (await GetContestProblemsCall(stageId)).data,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  const handleNavigate = (index: number) => {
    router.navigate({
      to: `/admin/jobs/${jobId}/stages/${stageId}/contest/`,
      search: { topic: 2, problem: index, section: 'description' },
      resetScroll: true,
    });
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-2">
      <ScrollArea className="h-[80%] w-full">
        <div className="flex flex-col justify-between gap-6">
          <Card
            title="Navigate to contest page"
            className="hover:bg-secondary/40 cursor-pointer"
            onClick={() => {
              router.navigate({
                to: `/admin/jobs/${jobId}/stages/${stageId}/contest`,
                search: { topic: 1 },
                resetScroll: true,
              });
            }}
          >
            <CardHeader>
              <CardTitle>{contest.title}</CardTitle>
              <CardDescription className="text-primary">
                Contest Overview
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1 ">
              <div>
                <strong className="text-muted-foreground">Duration:</strong>{' '}
                {contest.duration} minutes
              </div>
              <div>
                <strong className="text-muted-foreground">
                  Question Limit:
                </strong>{' '}
                {contest.noOfProblems}
              </div>
              <div className="capitalize">
                <strong className="text-muted-foreground">Type:</strong>{' '}
                {contest.contestType.replace('-', ' ')}
              </div>
            </CardContent>
          </Card>
          <ProblemsCard
            totalProblemCount={contest.noOfProblems}
            problems={problemsQuery.data?.data}
            isLoading={problemsQuery.isLoading}
            isError={problemsQuery.isError}
          />
        </div>
      </ScrollArea>
      <section className="flex flex-col gap-2 pt-0 w-full h-[20%] my-auto justify-end">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            disabled={search.problem <= 1}
            className="w-1/2 flex items-center justify-center gap-1 cursor-pointer"
            onClick={() => {
              if (search.problem > 1) {
                handleNavigate(search.problem - 1);
              }
            }}
          >
            <MdOutlineKeyboardDoubleArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            // disabled={search.problem >= problems.length}
            className="w-[47%] flex items-center justify-center gap-1 cursor-pointer"
            onClick={() => {
              if (search.problem < contest.noOfProblems) {
                handleNavigate(search.problem + 1);
              }
            }}
          >
            Next
            <MdOutlineKeyboardDoubleArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          title={
            problemsQuery.data?.data?.some(
              (problem) => problem.warnings.length > 0,
            )
              ? 'Resolve issues with all the problems first '
              : 'Launch contest'
          }
          disabled={problemsQuery.data?.data?.some(
            (problem) => problem.warnings.length > 0,
          )}
          className="w-full mt-1 cursor-pointer"
        >
          Launch
        </Button>
      </section>
    </div>
  );
};
