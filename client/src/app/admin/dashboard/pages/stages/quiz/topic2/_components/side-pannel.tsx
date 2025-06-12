import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { QuizProblemSchemaT, QuizSchemaT } from '@/lib/types/quiz';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter, useSearch } from '@tanstack/react-router';
import { PlusCircle } from 'lucide-react';
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from 'react-icons/md';
import {
  CreateQuizProblemCall,
  type CreateQuizProblemCallResponseT,
} from '../server-calls/create-quiz-problem';
import { toast } from 'sonner';

type Props = {
  problems: QuizProblemSchemaT[];
  quiz: QuizSchemaT;
};

export const SidePannel = ({ problems, quiz }: Props) => {
  const queries = useQueryClient();
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  }) satisfies { topic: number; question: number };

  const { jobId, stageId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  });

  const isComplete = problems.length === quiz.noOfQuestions;
  const router = useRouter();

  const handleNavigate = (index: number) => {
    router.navigate({
      to: `/admin/jobs/${jobId}/stages/${stageId}/quiz`,
      search: { topic: 2, question: index },
      resetScroll: true,
    });
    router.invalidate();
  };

  const createProblemMutation = useMutation({
    mutationFn: () => CreateQuizProblemCall(quiz.id),
    onMutate: () => {
      toast.loading('Updating Problem', {
        id: 'update_mutation',
        richColors: true,
      });
    },
    onSuccess: ({ data }: { data: CreateQuizProblemCallResponseT }) => {
      toast.success(data.message, { id: 'update_mutation', richColors: true });
      queries.invalidateQueries({
        queryKey: ['admin', 'stages', 'quiz', 'problems', stageId],
      });
      handleNavigate(data.data);
    },
    onError: (e) => {
      toast.error(e.message, {
        id: 'update_mutation',
        richColors: true,
      });
    },
  });

  const activeIndex = search.question;

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col justify-between gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription>Quiz Settings Overview</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-1 text-primary">
            <div>
              <strong className="text-muted-foreground">Duration:</strong>{' '}
              {quiz.duration} minutes
            </div>
            <div>
              <strong className="text-muted-foreground">Question Limit:</strong>{' '}
              {quiz.noOfQuestions}
            </div>
            <div>
              <strong className="text-muted-foreground">Type:</strong>{' '}
              {quiz.quizType}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problems</CardTitle>
            <CardDescription>
              {problems.length === 1
                ? '1 problem in this quiz'
                : `${problems.length} problems in this quiz`}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ScrollArea className="h-[300px] pr-2">
              <div className="flex flex-wrap gap-2 py-2 pl-1">
                {problems.map((problem) => {
                  const isActive = activeIndex === problem.questionIndex;
                  return (
                    <div
                      key={problem.id}
                      className={cn(
                        'cursor-pointer flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shadow-sm transition-all duration-150',
                        'hover:ring-2 hover:ring-primary hover:bg-muted/70',
                        isActive
                          ? 'bg-primary text-white'
                          : 'bg-muted text-foreground',
                      )}
                      onClick={() => handleNavigate(problem.questionIndex)}
                    >
                      {problem.questionIndex}
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
                      'rounded-full h-8 w-8 p-0 shadow-sm cursor-pointer',
                      'hover:ring-2 hover:ring-primary hover:bg-muted/70',
                    )}
                    variant="secondary"
                    title="Add a new problem"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground space-y-2">
            {isComplete ? (
              <span
                onClick={() =>
                  router.navigate({
                    to: `/admin/jobs/${jobId}/stages/${stageId}/quiz`,
                    search: { topic: 1 },
                  })
                }
                className="underline hover:text-primary transition-colors cursor-pointer"
              >
                Quiz has all{' '}
                <span className="font-medium">{quiz.noOfQuestions}</span>{' '}
                problems. You can update the count if needed from the panel.
              </span>
            ) : (
              <span>
                You’ve added{' '}
                <span className="font-medium">{problems.length}</span> of{' '}
                <span className="font-medium">{quiz.noOfQuestions}</span>{' '}
                required problems.
              </span>
            )}
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-2 pt-0 max-w-full">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              disabled={search.question <= 1}
              className="w-1/2 flex items-center justify-center gap-1"
              onClick={() => {
                if (search.question > 1) {
                  handleNavigate(search.question - 1);
                }
              }}
            >
              <MdOutlineKeyboardDoubleArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={search.question >= problems.length}
              className="w-[47%] flex items-center justify-center gap-1"
              onClick={() => {
                if (search.question < quiz.noOfQuestions) {
                  handleNavigate(search.question + 1);
                }
              }}
            >
              Next
              <MdOutlineKeyboardDoubleArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <Button className="w-full mt-1">Launch</Button>
        </div>
      </div>
    </ScrollArea>
  );
};
