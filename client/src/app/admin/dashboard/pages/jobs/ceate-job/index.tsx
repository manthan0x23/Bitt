import { useSidebar } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { CreateJobForm } from './_components/create-job-form';
import { Separator } from '@/components/ui/separator';

const CreateJob = () => {
  const { open } = useSidebar();

  return (
    <div className="h-full w-full flex items-center justify-center">
      <motion.div
        animate={{ width: open ? '100%' : '85%' }}
        transition={{ duration: 0.1, ease: 'backInOut' }}
        className="h-full max-w-full rounded-2xl p-6 transition-all"
      >
        <header className="mb-6">
          <h2 className="text-2xl font-semibold">Create a New Job Listing</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Fill in the required details to post a new job. Make sure to include
            a clear description, location, and type to attract the right
            candidates.
          </p>
        </header>

        <Separator className="mb-4" />
        <CreateJobForm />
      </motion.div>
    </div>
  );
};

export default CreateJob;
