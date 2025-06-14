import type { ContestAccessT, ContestTypeT } from '@/lib/types/contests';
import { useForm, useStore } from '@tanstack/react-form';
import { useParams, useRouter } from '@tanstack/react-router';
import {
  zUpdateContestSchema,
  type UpdateContestSchemaT,
} from './schema/update-contest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/common/markdown-editor';
import { Slider } from '@/components/ui/slider';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { formatMinutesToHoursAndMinutes } from '@/lib/date/format-minutes';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import {
  UpdateContestCall,
  type UpdateContestCallResponseT,
} from './server-calls/update-contest-call';
import { toast } from 'sonner';
import { ContestPreview } from './_components/contest-preview';
import { TbArrowLeft } from 'react-icons/tb';
import type { GetContestCallResponseT } from '../server-calls/get-contest-call';

type Props = {
  contest: GetContestCallResponseT['data'];
};

export const ContestTopic1 = ({ contest }: Props) => {
  const router = useRouter();
  const { stageId, jobId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  });

  const updateContestMutation = useMutation({
    mutationFn: (v: UpdateContestSchemaT) => UpdateContestCall(v),
    onMutate: () => {
      toast.loading('Updating Contest...', {
        id: 'update-contest',
      });
    },
    onSuccess: ({ data }: { data: UpdateContestCallResponseT }) => {
      toast.success(data.message, { id: 'update-contest' });
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.error || err.message || 'Something went wrong';
      toast.error(message, {
        id: 'update-contest',
      });
    },
  });

  const form = useForm({
    defaultValues: {
      ...contest,
      stageId,
      startAt: new Date(contest.startAt).toISOString(),
      endAt: contest.endAt ? new Date(contest.endAt).toISOString() : '',
    } as UpdateContestSchemaT,
    validators: {
      onBlur: zUpdateContestSchema,
      onBlurAsync: zUpdateContestSchema,
      onSubmit: zUpdateContestSchema,
      onSubmitAsync: zUpdateContestSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = zUpdateContestSchema.safeParse(value);
      if (parsed.success) updateContestMutation.mutate(parsed.data);
      else toast.error(parsed.error.message);
    },
  });

  const formValues = useStore(form.store, (state) => state.values);

  return (
    <div className="h-auto max-w-4xl mx-auto space-y-4">
      <div className="space-y-3 pt-8">
        <div className="flex items-center gap-4 mb-4 relative">
          <div
            className="text-muted-foreground p-2 cursor-pointer rounded-full hover:bg-muted transition absolute -left-13"
            onClick={() => {
              router.navigate({
                to: `/admin/jobs/${jobId}/edit`,
                resetScroll: true,
              });
            }}
          >
            <TbArrowLeft size={24} />
          </div>
          <h2 className="text-xl font-semibold">Configure Contest Settings</h2>
        </div>

        <p className="text-muted-foreground ">
          Set up essential details for your contest, including title, duration,
          availability, and monitoring preferences. These settings determine how
          participants will experience the contest.
        </p>
      </div>
      <form
        aria-disabled={form.state.isSubmitting}
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          form.handleSubmit();
          return;
        }}
        className="w-full mb-[7rem]"
      >
        <Tabs defaultValue="form" className="w-full">
          <div className="w-full flex items-center justify-between">
            <TabsList className="w-[160px]">
              <TabsTrigger value="form" className="cursor-pointer">
                Form
              </TabsTrigger>
              <TabsTrigger value="preview" className="cursor-pointer">
                Preview
              </TabsTrigger>
            </TabsList>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  aria-label="Skip form and go directly to the Problem Builder"
                  variant={'outline'}
                  type="button"
                  disabled={
                    !canSubmit || isSubmitting || form.state.isSubmitting
                  }
                  onClick={() => {
                    router.navigate({
                      to: `/admin/jobs/${jobId}/stages/${stageId}/contest/`,
                      search: {
                        topic: 2,
                        problem: 1,
                      },
                    });
                  }}
                  className="cursor-pointer"
                >
                  <ArrowRight />
                  Go to Contest Setup
                </Button>
              )}
            />
          </div>
          <TabsContent value="form" className="w-full">
            <section className=" space-y-6 mt-4">
              <form.Field name="title">
                {(field) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className={cn(
                        field.state.meta.errors.length > 0 &&
                          'text-destructive',
                      )}
                    >
                      Contest Title
                    </Label>
                    <Input
                      aria-invalid={field.state.meta.errors.length > 0}
                      id="title"
                      placeholder="e.g., Contest - II"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="description">
                {(field) => (
                  <div className="space-y-2">
                    <Label
                      className={cn(
                        field.state.meta.errors.length > 0 &&
                          'text-destructive',
                      )}
                      htmlFor="description"
                    >
                      Description
                    </Label>
                    <MarkdownEditor
                      placeholder="Short description of the contest..."
                      value={field.state.value}
                      onChange={(v) => field.handleChange(v)}
                      preview={false}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="instructions">
                {(field) => (
                  <div className="space-y-2">
                    <Label
                      className={cn(
                        field.state.meta.errors.length > 0 &&
                          'text-destructive',
                      )}
                      htmlFor="instructions"
                    >
                      Instructions
                    </Label>
                    <MarkdownEditor
                      placeholder="What should participants know before starting?"
                      value={field.state.value}
                      onChange={(v) => field.handleChange(v)}
                      preview={false}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="duration">
                {(field) => (
                  <div className="space-y-4">
                    <Label
                      htmlFor="duration"
                      className={cn(
                        field.state.meta.errors.length > 0 &&
                          'text-destructive',
                        'flex justify-between items-center',
                      )}
                    >
                      <span className="flex items-start gap-1 justify-start">
                        <span>Contest Duration</span>
                        <span className="text-muted-foreground font-normal text-xs">
                          (minutes)
                        </span>
                      </span>
                      <p>{formatMinutesToHoursAndMinutes(field.state.value)}</p>
                    </Label>
                    <Slider
                      id="duration"
                      min={30}
                      max={300}
                      step={5}
                      value={[field.state.value || 30]}
                      onValueChange={(v) => field.handleChange(v[0])}
                      onBlur={field.handleBlur}
                      aria-invalid={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <div className="flex gap-4">
                <form.Field name="noOfProblems">
                  {(field) => (
                    <div
                      className={cn(
                        'space-y-2 w-1/3',
                        formValues.contestType == 'live' && 'w-1/2',
                      )}
                    >
                      <Label
                        htmlFor="title"
                        className={cn(
                          field.state.meta.errors.length > 0 &&
                            'text-destructive',
                        )}
                      >
                        Number of Problems
                      </Label>
                      <Input
                        aria-invalid={field.state.meta.errors.length > 0}
                        placeholder="e.g. 15"
                        value={field.state.value}
                        type="number"
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
                <form.Field name="startAt">
                  {(field) => (
                    <div
                      className={cn(
                        'space-y-2 w-1/3',
                        formValues.contestType == 'live' && 'w-1/2',
                      )}
                    >
                      <Label
                        className={cn(
                          field.state.meta.errors.length > 0 &&
                            'text-destructive',
                        )}
                        htmlFor="startAt"
                      >
                        Start Date
                      </Label>
                      <DateTimePicker
                        className="w-full"
                        value={new Date(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(e?.toString() ?? '')
                        }
                        placeholder="Select start time"
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
                {formValues.contestType != 'live' && (
                  <form.Field name="endAt">
                    {(field) => (
                      <div className="space-y-2 w-1/3">
                        <Label
                          className={cn(
                            field.state.meta.errors.length > 0 &&
                              'text-destructive',
                          )}
                          htmlFor="endAt"
                        >
                          End Date
                        </Label>
                        <DateTimePicker
                          value={new Date(field.state.value)}
                          onChange={(e) =>
                            field.handleChange(e?.toString() ?? '')
                          }
                          placeholder="Select end time"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors[0]?.message}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                )}
              </div>

              <div className="w-full gap-4 flex items-center justify-center">
                <form.Field name="contestType">
                  {(field) => (
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="quizType">Quiz Type</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v: ContestTypeT) =>
                          field.handleChange(v)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select quiz type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="accessibility">
                  {(field) => (
                    <div className="space-y-2 w-1/2">
                      <Label htmlFor="accessibility">Access Level</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v: ContestAccessT) =>
                          field.handleChange(v)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="invite-only">
                            Invite Only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    ['requiresVideoMonitoring', 'Requires Video Monitoring'],
                    ['requiresAudioMonitoring', 'Requires Audio Monitoring'],
                    ['requiresAIMonitoring', 'Requires AI Monitoring'],
                    ['requiresScreenMonitoring', 'Requires Screen Monitoring'],
                    ['availableForPractise', 'Available for Practice'],
                  ] as const
                ).map(([key, label]) => (
                  <form.Field key={key} name={key}>
                    {(field) => (
                      <div className="flex items-center gap-2">
                        <Switch
                          className="cursor-pointer"
                          id={key}
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                        />
                        <Label htmlFor={key}>{label}</Label>
                      </div>
                    )}
                  </form.Field>
                ))}
              </div>

              <div className="w-full flex items-center justify-end">
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button
                      type="submit"
                      disabled={
                        !canSubmit || isSubmitting || form.state.isSubmitting
                      }
                      className="cursor-pointer"
                    >
                      Update Contest
                    </Button>
                  )}
                />
              </div>
            </section>
          </TabsContent>
          <TabsContent value="preview">
            <ContestPreview data={formValues} />
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};
