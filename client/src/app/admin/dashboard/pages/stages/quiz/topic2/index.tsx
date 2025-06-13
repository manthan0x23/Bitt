import { useQuery } from '@tanstack/react-query';
import { SidePannel } from './_components/side-pannel';
import { useParams } from '@tanstack/react-router';
import {
  GetQuizProblemsCall,
  type GetQuizProblemsCallResponseT,
} from './server-calls/get-quiz-problems';
import { useSidebar } from '@/components/ui/sidebar';
import { useEffect } from 'react';
import { QuestionPage } from './_components/question-page';
import type { QuizSchemaT } from '@/lib/types/quiz';

type Props = {
  quiz: QuizSchemaT;
};

export const QuizTopic2 = ({ quiz }: Props) => {
  const { setOpen } = useSidebar();
  const { stageId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  });

  const quizProblemsQuery = useQuery({
    queryKey: ['admin', 'stages', 'quiz', 'problems', stageId],
    queryFn: () => GetQuizProblemsCall(stageId),
    select: ({ data }: { data: GetQuizProblemsCallResponseT }) => data.data,
  });

  useEffect(() => {
    setOpen(false);
  }, []);

  if (quizProblemsQuery.error || !quiz.id) {
    window.location.reload();
  }

  return (
    <div className="max-w-full  h-full flex items-center justify-center ">
      <div className="h-full w-[80%] p-2">
        <QuestionPage />
      </div>
      <div className="h-full w-[20%] p-2">
        {quizProblemsQuery.data && quiz && (
          <SidePannel problems={quizProblemsQuery.data} quiz={quiz} />
        )}
      </div>
    </div>
  );
};
