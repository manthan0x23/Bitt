import { useParams, useRouter, useSearch } from '@tanstack/react-router';
import { QuizTopic1 } from './topic1';
import { QuizTopic2 } from './topic2';
import { useQuery } from '@tanstack/react-query';
import {
  GetQuizCall,
  type GetQuizCallResponseT,
} from './server-calls/get-quiz-call';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const QuizPannelAdmin = () => {
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  }) as { topic?: number };
  const router = useRouter();

  const hasShownToast = useRef(false);

  const { stageId, jobId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  });

  const quizQuery = useQuery({
    queryKey: ['admin', 'stages', 'quiz', 'get', stageId],
    queryFn: () => GetQuizCall(stageId),
    select: ({ data }: { data: GetQuizCallResponseT }) => data,
  });

  useEffect(() => {
    if (quizQuery.isSuccess && !hasShownToast.current) {
      toast.success(quizQuery.data.message, { richColors: true });
      hasShownToast.current = true;
    }

    if (quizQuery.error) {
      toast.error(quizQuery.data?.error, { richColors: true });
      router.navigate({
        to: `/admin/jobs/${jobId}/edit`,
        resetScroll: true,
        reloadDocument: true,
      });
    }
  }, [quizQuery.isSuccess, quizQuery.data]);

  return (
    <>
      {quizQuery.data?.data &&
        (!search.topic || search.topic == 1 ? (
          <QuizTopic1 quiz={quizQuery.data.data} />
        ) : (
          <QuizTopic2 quiz={quizQuery.data.data} />
        ))}
    </>
  );
};
