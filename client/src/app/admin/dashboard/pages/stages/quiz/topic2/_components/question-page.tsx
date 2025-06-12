import { useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import {
  GetQuizProblemByIdCall,
  type GetQuizProblemByIdCallResponseT,
} from '../server-calls/get-quiz-problem-by-id';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { QuestionView } from './question-view';
import { QuestionEdit } from './question-edit';

export const QuestionPage = () => {
  const { stageId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  });
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  }) satisfies { topic: number; question: number };

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'admin',
      'stages',
      'quiz',
      'problem',
      search.question,
      'stage',
      stageId,
    ],
    queryFn: () => GetQuizProblemByIdCall(search.question, stageId),
    select: ({ data }: { data: GetQuizProblemByIdCallResponseT }) => data.data,
  });

  const [editing, setEditing] = useState(false);

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (isError)
    return <div className="text-red-500">Error loading question.</div>;
  if (!data) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center gap-4 text-muted-foreground">
        <h4 className="text-lg font-semibold text-foreground">
          No question found!
        </h4>
        <p className="max-w-md text-sm">
          This quiz doesn't seem to have any questions at this index. Start by
          adding a new problem.
        </p>
      </div>
    );
  }

  return (
    <div  className='max-h-full h-auto'>
      <ScrollArea className="h-full w-full p-6">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex justify-between">
            <h4 className="text-2xl font-bold text-muted-foreground">
              Question {data.questionIndex}
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {editing ? (
            <QuestionEdit data={data} />
          ) : (
            <QuestionView data={data} />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
