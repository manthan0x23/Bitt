// QuizTopic1PageAdmin.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useEffect, useCallback } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import {
  UpdateQuizSchema,
  type UpdateQuizSchemaT,
} from './schema/update-quiz-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuizPreview } from './_components/quiz-preview';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import type { QuizStateT, QuizTypeT } from '@/lib/types/quiz';
import { Slider } from '@/components/ui/slider';
import { UpdateQuizCall } from './server-calls/update-quiz-call';
import { ArrowRight } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { MarkdownEditor } from '@/components/common/markdown-editor';
import { PiMagicWandFill } from 'react-icons/pi';
import { TagsInput } from '@/components/ui/tag-input';
import {
  GenerateQuizCall,
  type GenerateQuizCallResponseT,
} from './server-calls/generate-with-ai-call';
import type { z } from 'zod/v4';
import { TbArrowLeft } from 'react-icons/tb';
import type { GetQuizCallResponseT } from './server-calls/get-quiz-call';

type Props = {
  quiz: GetQuizCallResponseT['data'];
};

export const QuizTopic1 = ({ quiz }: Props) => {
  const router = useRouter();

  const queries = useQueryClient();

  const { setOpen } = useSidebar();
  const { stageId, jobId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  });

  useEffect(() => {
    setOpen(false);
  }, []);

  const invalidateGetQuizQuery = useCallback(() => {
    queries.invalidateQueries({
      queryKey: ['admin', 'stages', 'quiz', 'get', stageId],
    });
  }, [stageId]);

  const updateQuizMutation = useMutation({
    mutationFn: (v: UpdateQuizSchemaT) => UpdateQuizCall(v),
    onSuccess: () => {
      queries.invalidateQueries({
        queryKey: ['admin', 'stages', 'quiz', 'get', stageId],
      });
      toast.success('Quiz updated successfully', { richColors: true });
    },
  });

  const generateQuizMutation = useMutation({
    mutationFn: () => GenerateQuizCall(stageId),
    onMutate: () => {
      toast.loading('Generating Questions...', {
        id: 'generate-quiz',
        richColors: true,
      });
    },
    onSuccess: ({ data }: { data: GenerateQuizCallResponseT }) => {
      toast.success(data.message, { id: 'generate-quiz', richColors: true });
      invalidateGetQuizQuery();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Something went wrong', {
        id: 'generate-quiz',
        richColors: true,
      });
      invalidateGetQuizQuery();
    },
  });

  const form = useForm({
    defaultValues: {
      ...quiz,
      stageId: stageId,
      startAt: new Date(quiz.startAt ?? '').toISOString(),
      endAt: new Date(quiz.endAt ?? '').toISOString(),
    } as z.infer<typeof UpdateQuizSchema>,
    validators: {
      onBlur: UpdateQuizSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = UpdateQuizSchema.safeParse(value);

      if (parsed.error) console.error(parsed.error);
      else updateQuizMutation.mutate(value);
    },
  });

  const formValues = useStore(form.store, (state) => state.values);

  return (
    <div
      className="h-auto max-w-4xl mx-auto"
      aria-disabled={generateQuizMutation.isPending}
    >
      <div className="space-y-2 pt-8">
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
          <h2 className="text-xl font-semibold">Configure Quiz Settings</h2>
        </div>
        <p className="text-muted-foreground">
          Set up essential details for your quiz, including title, duration,
          availability, and monitoring preferences. These settings determine how
          participants will experience the quiz.
        </p>
      </div>
      <Tabs defaultValue="form" className="mt-6">
        <div className="w-full flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="form" className="cursor-pointer">
              Form
            </TabsTrigger>
            <TabsTrigger value="preview" className="cursor-pointer">
              Preview
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-3">
            <Button
              disabled={
                quiz.noOfQuestions == quiz.questionsCount ||
                generateQuizMutation.isPending
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                generateQuizMutation.mutate();
              }}
              variant="outline"
              className="cursor-pointer"
            >
              <PiMagicWandFill className="mr-1 text-sm" />
              Generate Questions
            </Button>
            <Button
              disabled={generateQuizMutation.isPending}
              onClick={() => {
                router.navigate({
                  to: `/admin/jobs/${jobId}/stages/${stageId}/quiz`,
                  search: {
                    topic: 2,
                    question: 1,
                  },
                });
                router.invalidate();
              }}
              variant="outline"
              className="cursor-pointer"
            >
              <ArrowRight className="mr-1 text-sm" />
              Skip to Question Builder
            </Button>
          </div>
        </div>

        <TabsContent value="form" className="pb-8">
          <form
            aria-disabled={generateQuizMutation.isPending}
            className="w-full space-y-6 mt-4 mb-8 "
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
              return;
            }}
          >
            {/* Title */}
            <form.Field name="title">
              {(field) => (
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className={cn(
                      field.state.meta.errors.length > 0 && 'text-destructive',
                    )}
                  >
                    Quiz Title
                  </Label>
                  <Input
                    aria-invalid={field.state.meta.errors.length > 0}
                    id="title"
                    placeholder="e.g., JavaScript Concepts Quiz"
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

            {/* Description */}
            <form.Field name="description">
              {(field) => (
                <div className="space-y-2">
                  <Label
                    className={cn(
                      field.state.meta.errors.length > 0 && 'text-destructive',
                    )}
                    htmlFor="description"
                  >
                    Description
                  </Label>
                  <MarkdownEditor
                    placeholder="Short description of the quiz..."
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
                      field.state.meta.errors.length > 0 && 'text-destructive',
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

            {/* Duration */}
            <form.Field name="duration">
              {(field) => (
                <div className="space-y-4">
                  <Label
                    htmlFor="duration"
                    className={cn(
                      field.state.meta.errors.length > 0 && 'text-destructive',
                      'flex justify-between items-center',
                    )}
                  >
                    <p>Duration (in minutes)</p>
                    <p>{field.state.value} min</p>
                  </Label>
                  <Slider
                    id="duration"
                    min={15}
                    max={180}
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
              <form.Field name="noOfQuestions">
                {(field) => (
                  <div className="space-y-2 w-1/3">
                    <Label
                      htmlFor="title"
                      className={cn(
                        field.state.meta.errors.length > 0 &&
                          'text-destructive',
                      )}
                    >
                      No. of Questions
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
                  <div className="space-y-2 w-1/3">
                    <Label
                      className={cn(
                        field.state.meta.errors.length > 0 &&
                          'text-destructive',
                      )}
                      htmlFor="startAt"
                    >
                      Start Time
                    </Label>
                    <DateTimePicker
                      value={new Date(field.state.value)}
                      onChange={(e) => field.handleChange(e?.toString() ?? '')}
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
                      End Time
                    </Label>
                    <DateTimePicker
                      value={new Date(field.state.value)}
                      onChange={(e) => field.handleChange(e?.toString() ?? '')}
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
            </div>

            <form.Field name="tags">
              {(field) => (
                <div className="space-y-2 ">
                  <Label htmlFor="quizType">Tags</Label>
                  <TagsInput
                    value={field.state.value}
                    onChange={(c) => field.handleChange(c)}
                  />
                </div>
              )}
            </form.Field>

            <div className="w-full gap-4 flex items-center justify-center">
              <form.Field name="quizType">
                {(field) => (
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="quizType">Quiz Type</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) => field.handleChange(v as QuizTypeT)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select quiz type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="take-home">Take Home</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              {/* Accessibility */}
              <form.Field name="accessibility">
                {(field) => (
                  <div className="space-y-2 w-1/2">
                    <Label htmlFor="accessibility">Access Level</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) => field.handleChange(v as QuizStateT)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="invite-only">Invite Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>
            </div>
            {/* Quiz Type */}

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
                      !canSubmit ||
                      isSubmitting ||
                      generateQuizMutation.isPending
                    }
                    className="cursor-pointer"
                  >
                    Update Quiz
                  </Button>
                )}
              />
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview" className="pb-8">
          <QuizPreview data={formValues} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
