import { useSearch } from '@tanstack/react-router';

export const AdminInterviewStageView = () => {
  const searchP = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/interview/',
  });

  return <div>{JSON.stringify(searchP)}</div>;
};
