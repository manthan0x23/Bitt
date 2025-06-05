import { shortId } from '@/lib/shorId';
import { z } from 'zod/v4';
import { useForm } from '@tanstack/react-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { JobScreeningTypeT, JobTypeT } from '@/lib/types/jobs';
import { MarkdownEditor } from '@/components/common/markdown-editor';
import { useStore } from '@tanstack/react-store';
import { CreateJobFormPreview } from './create-job-form-preview';
import { MultiSelect } from '@/components/ui/multi-select';
import { JobTags } from '@/integrations/data/job-tags';
import { CreateJobFormSchema } from '../schemas';
import { useMutation } from '@tanstack/react-query';
import { createJobCall, type CreateJobResponse } from '../server-calls';
import { toast } from 'sonner';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Switch } from '@/components/ui/switch';
import { useRouter } from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const InitialFormState: Partial<z.infer<typeof CreateJobFormSchema>> = {
  title: '',
  slug: shortId(6),
  description: '',
  location: '',
  type: 'full-time',
  screeningType: 'single-stage',
  tags: [],
  endDate: '',
  resumeRequired: true,
  coverLetterRequired: true,
};

export const CreateJobForm = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [jobId, setJobId] = useState('');

  const router = useRouter();

  const form = useForm({
    defaultValues: InitialFormState,
    validators: {
      onBlur: CreateJobFormSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = CreateJobFormSchema.safeParse(value);
      if (parsed.error) {
        toast.error(parsed.error.message, { richColors: true });
      } else {
        mutate(parsed.data);
      }
    },
  });

  const values = useStore(form.store, (state) => state.values);
  const { mutate } = useMutation({
    mutationFn: createJobCall,
    onError: (e) => {
      toast.error(e.message, { richColors: true });
    },
    onSuccess: ({ data }: { data: CreateJobResponse }) => {
      setJobId(data.data.id);

      if (values.screeningType === 'application') {
        setTimeout(() => {
          router.navigate({ to: '/admin', resetScroll: true, replace: true });
        }, 1500);
      } else {
        setShowDialog(true);
      }
    },
  });

  return (
    <div className="w-full flex items-start justify-between gap-6 pb-15">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <h4>Job Saved as Draft</h4>
            <DialogDescription className="text-primary/70">
              This job requires a contest to be created before it can be
              published. You can create the contest now or do it later from the
              admin panel.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              size={'sm'}
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                router.navigate({ to: '/admin' });
              }}
            >
              Make Contest Later
            </Button>
            <Button
              size={'sm'}
              onClick={() => {
                setShowDialog(false);
                router.navigate({ to: `/admin/jobs/${jobId}/edit` });
              }}
            >
              Make Contest Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <form
        className="w-1/2 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="title">
          {(field) => (
            <div className="space-y-2">
              <Label
                className={cn(
                  field.state.meta.errors.length > 0 && ' text-destructive',
                )}
                htmlFor="title"
              >
                Job Title
              </Label>
              <Textarea
                id="title"
                minLength={2}
                placeholder="e.g., Senior Frontend Engineer"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
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

        <form.Field name="description">
          {(field) => (
            <div className="space-y-2">
              <Label
                className={cn(
                  field.state.meta.errors.length > 0 && ' text-destructive',
                )}
                htmlFor="description"
              >
                Job Description
              </Label>
              <MarkdownEditor
                preview={false}
                aria-invalid={field.state.meta.errors.length > 0}
                value={field.state.value || ''}
                onChange={(v) => {
                  const wordCount = v
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean).length;
                  if (wordCount <= 400) field.handleChange(v);
                }}
                placeholder="Describe the job responsibilities..."
              />
              <p className="text-sm text-muted-foreground text-right">
                {field.state.value?.split(/\s+/).filter(Boolean).length || 0}
                /400 words
              </p>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="location">
          {(field) => (
            <div className="space-y-2 ">
              <Label
                className={cn(
                  field.state.meta.errors.length > 0 && ' text-destructive',
                )}
                htmlFor="location"
              >
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Remote, Bengaluru, New York"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
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
        <form.Field name="endDate">
          {(field) => (
            <div className="space-y-2 ">
              <Label
                className={cn(
                  field.state.meta.errors.length > 0 && ' text-destructive',
                )}
                htmlFor="endDate"
              >
                Application Ends At
              </Label>
              <DateTimePicker
                value={field.state.value ?? undefined}
                onChange={(date) => field.handleChange(date)}
                placeholder="Select application deadline"
                minDate={new Date()}
                className="w-full"
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

        <form.Field name="tags">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <MultiSelect
                placeholder="Select tags"
                options={JobTags}
                variant={'default'}
                animation={2}
                maxCount={5}
                value={field.state.value}
                defaultValue={[]}
                onValueChange={field.handleChange}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <span className="w-full flex gap-4">
          <form.Field name="type">
            {(field) => (
              <div className="space-y-2 w-1/2">
                <Label htmlFor="type">Job Type</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v as JobTypeT)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <form.Field name="screeningType">
            {(field) => (
              <div className="space-y-2 w-1/2">
                <Label htmlFor="screeningType">Screening Type</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as JobScreeningTypeT)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose screening type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="application">Application</SelectItem>
                    <SelectItem value="single-stage">Single-stage</SelectItem>
                    <SelectItem value="multi-stage">Multi-stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
        </span>

        <form.Field name="slug">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="slug">Job Id (Auto-generated)</Label>
              <p className="text-xs text-inherit">
                Enter your company's referenced Job-Id or just leave it to us.
              </p>
              <Input
                id="slug"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <span className="w-full flex gap-4 items-center justify-start">
          <form.Field name="resumeRequired">
            {(field) => (
              <div className="flex justify-start items-center gap-2">
                <Switch
                  id="resume-required"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  className="cursor-pointer"
                />
                <Label htmlFor="resume-required">Requires Resume</Label>
              </div>
            )}
          </form.Field>
          <form.Field name="coverLetterRequired">
            {(field) => (
              <div className="flex justify-start items-center gap-2">
                <Switch
                  id="cover-letter-required"
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  className="cursor-pointer"
                />
                <Label htmlFor="resume-required">Requires Cover letter</Label>
              </div>
            )}
          </form.Field>
        </span>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              Create Job
            </Button>
          )}
        />
      </form>

      <CreateJobFormPreview state={values} />
    </div>
  );
};
