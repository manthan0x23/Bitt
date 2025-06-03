import { JobsInteract } from '../_components/jobs-interact';

export const JobsPannel = () => {
  return (
    <div className="h-full w-full ">
      <section className="flex flex-col gap-2">
        <h2>Your Job Postings</h2>
        <p className="text-primary/60 w-1/2">
          Manage all the jobs posted by your organization. Track status,
          screening methods, and linked contests. Quickly edit, clone, or close
          a job as needed.
        </p>
      </section>
      <JobsInteract />
    </div>
  );
};
