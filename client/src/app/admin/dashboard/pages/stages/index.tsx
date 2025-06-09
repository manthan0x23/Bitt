import { useParams } from '@tanstack/react-router';

export const StageViewAdmin = () => {
  
  const { jobId, stageId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/',
  });

  return (
    <div>
      {jobId}
      <br />
      {stageId}
    </div>
  );
};
