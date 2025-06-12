import { useQuery } from '@tanstack/react-query';
import { SidePannel } from './_components/side-pannel';
import { useParams } from '@tanstack/react-router';
import {
  GetQuizProblemsCall,
  type GetQuizProblemsCallResponseT,
} from './server-calls/get-quiz-problems';
import { useSidebar } from '@/components/ui/sidebar';
import { useEffect } from 'react';
import {
  GetQuizCall,
  type GetQuizCallResponseT,
} from '../topic1/server-calls/get-quiz-call';
import { QuestionPage } from './_components/question-page';

export const QuizTopic2 = () => {
  const { setOpen } = useSidebar();
  const { stageId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  });

  const quizProblemsQuery = useQuery({
    queryKey: ['admin', 'stages', 'quiz', 'problems', stageId],
    queryFn: () => GetQuizProblemsCall(stageId),
    select: ({ data }: { data: GetQuizProblemsCallResponseT }) => data.data,
  });
  const quizQuery = useQuery({
    queryKey: ['admin', 'stages', 'quiz', 'get', stageId],
    queryFn: () => GetQuizCall(stageId),
    select: ({ data }: { data: GetQuizCallResponseT }) => data.data,
  });

  useEffect(() => {
    setOpen(false);
  }, []);

  if (quizProblemsQuery.error || quizQuery.error) {
    window.location.reload();
  }

  return (
    <div className="max-w-full  h-full flex items-center justify-center ">
      <div className="h-full w-[80%] p-2">
        <QuestionPage />
      </div>
      <div className="h-full w-[20%] p-2">
        {quizProblemsQuery.data && quizQuery.data && (
          <SidePannel problems={quizProblemsQuery.data} quiz={quizQuery.data} />
        )}
      </div>
    </div>
  );
};
