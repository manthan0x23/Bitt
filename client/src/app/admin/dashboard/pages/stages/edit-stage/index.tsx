import { useSidebar } from '@/components/ui/sidebar';
import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

export const StageEdit = () => {
  const { setOpen } = useSidebar();


  useEffect(() => {
    setOpen(false);
  }, []);

  const { jobId, stageId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/edit',
  });

  return (
    <div>
      {jobId}
      <br />
      {stageId}
    </div>
  );
};
