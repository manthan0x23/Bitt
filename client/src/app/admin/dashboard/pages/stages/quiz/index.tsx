import { useSearch } from '@tanstack/react-router';
import { QuizTopic1 } from './topic1';
import { QuizTopic2 } from './topic2';

export const QuizPannelAdmin = () => {
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  }) as { topic?: number };

  return (
    <>{!search.topic || search.topic == 1 ? <QuizTopic1 /> : <QuizTopic2 />}</>
  );
};
