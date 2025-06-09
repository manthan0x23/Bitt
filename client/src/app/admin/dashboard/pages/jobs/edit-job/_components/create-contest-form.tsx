import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { JobSchemaT } from '@/lib/types/jobs';
import { useQuery } from '@tanstack/react-query';
import {
  getStagesByJobId,
  type GetStagesByJobIdResponseT,
} from '../server-calls/get-job-stages';
import { useParams } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { AddStageDialog } from './add-stage-dialouge';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaCirclePlus } from 'react-icons/fa6';
import { StageTypeRender } from './stage-type-render';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BsFillPeopleFill } from 'react-icons/bs';
import { cn } from '@/lib/utils';

type Props = {
  job: JobSchemaT;
};

export const EditStagesForm = ({ job }: Props) => {
  const [open, setOpen] = useState(false);
  const { jobId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/edit',
  });

  const { data: stages, isLoading: loadingStages } = useQuery({
    queryKey: ['admins', 'jobs', 'all', jobId, 'edit'],
    queryFn: async () => (await getStagesByJobId(jobId)).data,
    select: (data: GetStagesByJobIdResponseT) => data.data,
  });

  return (
    <>
      {stages && (
        <AddStageDialog
          jobId={jobId}
          open={open}
          setOpen={setOpen}
          stageIndex={(stages.length ?? 0) + 1}
          inflow={
            stages.length > 0 ? stages[stages.length - 1].outflow : undefined
          }
        />
      )}
      <div className="mt-8">
        {stages &&
          (stages.length == 0 ||
            stages[stages.length - 1].type != 'interview') && (
            <Alert variant="info">
              <AlertTitle>Recommendation</AlertTitle>
              <AlertDescription>
                We recommend adding an Interview stage to effectively evaluate
                candidates beyond automated assessments. This helps ensure
                better alignment with your team's expectations.
              </AlertDescription>
            </Alert>
          )}
      </div>
      <div className="flex gap-4 items-start overflow-y-hidden">
        {loadingStages ? (
          <Skeleton className="border rounded-2xl w-2/3 h-[60vh]" />
        ) : stages?.length == 0 ? (
          <div className="border border-dashed rounded-2xl w-2/3 h-[60vh] p-6 flex flex-col items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">Feels empty here !</p>
            <Button
              onClick={() => setOpen(true)}
              variant={'outline'}
              className="cursor-pointer"
            >
              <FaCirclePlus />
              Add Stage
            </Button>
          </div>
        ) : (
          <ScrollArea className="w-2/3 h-[60vh] rounded-xl bg-muted/5 border border-border ">
            <div className="flex flex-col items-center justify-start space-y-3 m-6">
              {stages?.map((stage) => (
                <div
                  key={stage.id}
                  className="h-auto relative w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-3 flex flex-col gap-1 transition-all hover:border-primary/20  hover:scale-[1.01] hover:bg-muted"
                >
                  <span
                    className="absolute -left-3 top-1/2 -translate-y-1/2 text-xs bg-accent font-normal text-primary border border-border rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                    title={`Stage ${stage.stageIndex}`}
                  >
                    {stage.stageIndex}
                  </span>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <StageTypeRender type={stage.type} size={2} />
                    <span className="font-medium text-foreground/80 flex items-center gap-2">
                      <BsFillPeopleFill />
                      {stage.inflow} → {stage.outflow}
                    </span>
                  </div>

                  <span className="w-full flex justify-between items-center text-sm text-foreground/80 ">
                    <p className="truncate w-full h-full text-wrap">
                      {stage.description}
                    </p>
                    <p
                      className={cn(
                        'text-xs h-full items-end justify-end italic font-medium',
                        stage.isFinal ? 'text-green-500' : 'text-destructive',
                      )}
                    >
                      {stage.isFinal ? 'Ready' : 'Pending'}
                    </p>
                  </span>

                  {stage.type !== 'resume_filter' &&
                    stage.startAt &&
                    stage.endAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(stage.startAt).toLocaleString()} →
                        {new Date(stage.endAt).toLocaleString()}
                      </p>
                    )}
                </div>
              ))}

              <Button
                size="sm"
                onClick={() => setOpen(true)}
                variant="outline"
                className="text-sm text-muted-foreground hover:bg-muted/40 transition-colors cursor-pointer"
              >
                Add Stage
              </Button>
            </div>
          </ScrollArea>
        )}

        <div className="w-1/3 h-full ">
          <div className="h-[90%] w-full">
            <Card className="w-full bg-primary-foreground">
              <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                <h4 className="text-base font-semibold text-foreground">
                  {job.title}
                </h4>
                <div>
                  <span className="font-medium text-foreground">Job ID: </span>
                  {job.id}
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Location:{' '}
                  </span>
                  {job.location}
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Openings:{' '}
                  </span>
                  {job.openings}
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Experience:{' '}
                  </span>
                  {job.experience}+ years
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    End Date:{' '}
                  </span>
                  {new Date(job.endDate).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-5">
            <Button className="w-full cursor-pointer">Launch</Button>
          </div>
        </div>
      </div>
    </>
  );
};
