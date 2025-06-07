import { Button } from '@/components/ui/button';
import { FaCirclePlus } from 'react-icons/fa6';
import { JobsTableShell } from './jobs-table-shell';
import { useRouter } from '@tanstack/react-router';

export const JobsInteract = () => {
  const router = useRouter();

  return (
    <div className="w-full h-auto mt-2 pb-8">
      <div className="w-full flex justify-end items-center">
        <Button
          onClick={() =>
            router.navigate({
              to: '/admin/jobs/create',
            })
          }
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear cursor-pointer"
        >
          <FaCirclePlus className="mr-2" />
          <span>Create Job</span>
        </Button>
      </div>
      <div className="h-full w-full mt-5">
        <JobsTableShell />
      </div>
    </div>
  );
};
