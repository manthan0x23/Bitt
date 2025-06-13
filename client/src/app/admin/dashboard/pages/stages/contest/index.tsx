import { useSearch } from '@tanstack/react-router';
import { ContestTopic1Pannel } from './topic1';
import { ContestTopic2Pannel } from './topic2';

export const ContestPannelAdmin = () => {
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  }) satisfies { topic: number };

  return (
    <>{search.topic == 1 ? <ContestTopic1Pannel /> : <ContestTopic2Pannel />}</>
  );
};
