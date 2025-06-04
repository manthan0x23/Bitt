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
import { createJobCall } from '../server-calls';
import { toast } from 'sonner';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Switch } from '@/components/ui/switch';

const InitialFormState: Partial<z.infer<typeof CreateJobFormSchema>> = {
  title: '',
  slug: shortId(6),
  description: '',
  location: '',
  type: 'full-time',
  screeningType: 'single-stage',
  tags: [],
  endDate: '',
  resumeRequired: false,
};

export const CreateJobForm = () => {
  const { mutate } = useMutation({
    mutationFn: createJobCall,
    onError: (e) => {
      toast.error(e.message, { richColors: true });
    },
    onSuccess: () => {
      toast.success('Job created successfully', { richColors: true });
    },
  });

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

  return (
    <div className="w-full flex items-start justify-between gap-6">
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
              <Label htmlFor="title">Job Title</Label>
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
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <MarkdownEditor
                preview={false}
                value={field.state.value || ''}
                onChange={(v) => field.handleChange(v)}
                placeholder="Describe the job responsibilities..."
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="location">
          {(field) => (
            <div className="space-y-2 ">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Remote, Bengaluru, New York"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <form.Field name="endDate">
          {(field) => (
            <div className="space-y-2 ">
              <Label htmlFor="endDate">Application Ends At</Label>
              <DateTimePicker
                value={
                  field.state.value ? new Date(field.state.value) : undefined
                }
                onValueChange={(date) => {
                  field.handleChange(date?.toISOString() || '');
                }}
                placeholder="Select application deadline"
                minDate={new Date()}
                className="w-full"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500">
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
                <p className="text-sm text-red-500">
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

          {/* Screening Type */}
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
              <Label htmlFor="slug">Slug (Auto-generated)</Label>
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

        <form.Field name="resumeRequired">
          {(field) => (
            <div className="flex justify-start items-center gap-2">
              <Switch
                id="resume-required"
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
                className="cursor-pointer"
              />
              <Label htmlFor="resume-required">Require Resume</Label>
            </div>
          )}
        </form.Field>

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
