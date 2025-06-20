import { JobsInteract } from './_components/jobs-interact';

export const JobsPanelAdmin = () => {
  return (
    <div className="h-full w-full">
      <section className="space-y-1">
        <h3 className="text-xl font-semibold">Job Postings</h3>
        <p className="text-muted-foreground w-1/2 text-wrap text-sm">
          View and manage all jobs posted by your organization. Track job status,
          screening methods, and associated contests. Edit, duplicate, or close
          job listings as needed.
        </p>
      </section>
      <JobsInteract />
    </div>
  );
};
