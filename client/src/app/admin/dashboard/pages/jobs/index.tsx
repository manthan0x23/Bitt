import { JobsInteract } from './_components/jobs-interact';

export const JobsPanelAdmin = () => {
  return (
    <div className="h-full w-full">
      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Job Postings</h2>
        <p className="text-muted-foreground w-1/2">
          View and manage all jobs posted by your organization. Track job status,
          screening methods, and associated contests. Edit, duplicate, or close
          job listings as needed.
        </p>
      </section>
      <JobsInteract />
    </div>
  );
};
