// QuizTopic1PageAdmin.tsx
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  GetQuizCall,
  type GetQuizCallResponseT,
} from './server-calls/get-quiz-call';
import { useParams, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useRef, useEffect } from 'react';
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

export const QuizTopic1 = () => {
  const router = useRouter();

  const { setOpen } = useSidebar();
  const { stageId, jobId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  });
  const hasShownToast = useRef(false);
  const quizQuery = useQuery({
    queryKey: ['admin', 'stages', 'quiz', 'get', stageId],
    queryFn: () => GetQuizCall(stageId),
    select: ({ data }: { data: GetQuizCallResponseT }) => data,
  });

  useEffect(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (quizQuery.isSuccess && !hasShownToast.current) {
      toast.success(quizQuery.data.message, { richColors: true });
      hasShownToast.current = true;
    }

    if (quizQuery.error) {
      toast.error(quizQuery.data?.error, { richColors: true });
      router.navigate({
        to: `/admin/jobs/${jobId}/edit`,
        resetScroll: true,
        reloadDocument: true,
      });
    }
  }, [quizQuery.isSuccess, quizQuery.data]);

  const quizMutation = useMutation({
    mutationFn: (v: UpdateQuizSchemaT) => UpdateQuizCall(v),
    onSuccess: () => {
      quizQuery.refetch();
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
      quizQuery.refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Something went wrong', {
        id: 'generate-quiz',
        richColors: true,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      title: quizQuery.data?.data.title ?? '',
      stageId: stageId,
      description: quizQuery.data?.data.description ?? '',
      instructions: quizQuery.data?.data.instructions ?? '',
      startAt: quizQuery.data?.data.startAt!.toString() ?? '',
      endAt: quizQuery.data?.data.endAt!.toString() ?? '',

      duration: Number(quizQuery.data?.data.duration ?? 30),
      noOfQuestions: quizQuery.data?.data.noOfQuestions ?? 1,

      quizType: quizQuery.data?.data.quizType ?? 'take-home',
      state: quizQuery.data?.data.state ?? 'open',
      accessibility: quizQuery.data?.data.accessibility ?? 'public',

      requiresVideoMonitoring:
        quizQuery.data?.data.requiresVideoMonitoring ?? false,
      requiresAudioMonitoring:
        quizQuery.data?.data.requiresAudioMonitoring ?? false,
      requiresAIMonitoring: quizQuery.data?.data.requiresAIMonitoring ?? false,
      requiresScreenMonitoring:
        quizQuery.data?.data.requiresScreenMonitoring ?? false,

      tags: quizQuery.data?.data.tags ?? [],

      availableForPractise: quizQuery.data?.data.availableForPractise ?? false,
    },
    onSubmit: ({ value }) => {
      const parsed = UpdateQuizSchema.safeParse(value);

      if (parsed.error) console.error(parsed.error);
      else quizMutation.mutate(value);
    },
  });

  const formValues = useStore(form.store, (state) => state.values);

  return (
    <div
      className="h-auto max-w-4xl mx-auto"
      aria-disabled={generateQuizMutation.isPending}
    >
      <div className="space-y-2 pt-8">
        <h2>Configure Quiz Settings</h2>
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
                quizQuery.data?.data.noOfQuestions ==
                  quizQuery.data?.data.questionsCount ||
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
              onClick={() =>
                router.navigate({
                  to: `/admin/jobs/${jobId}/stages/${stageId}/quiz`,
                  search: {
                    topic: 2,
                    question: 1,
                  },
                })
              }
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
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Description */}
            <form.Field name="description">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <MarkdownEditor
                    placeholder="Short description of the quiz..."
                    value={field.state.value}
                    onChange={(v) => field.handleChange(v)}
                    preview={false}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Instructions */}
            <form.Field name="instructions">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <MarkdownEditor
                    placeholder="What should participants know before starting?"
                    value={field.state.value}
                    onChange={(v) => field.handleChange(v)}
                    preview={false}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
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
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Start and End Time */}
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
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="startAt">
                {(field) => (
                  <div className="space-y-2 w-1/3">
                    <Label htmlFor="startAt">Start Time</Label>
                    <DateTimePicker
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e?.toString() ?? '')}
                      minDate={new Date()}
                      placeholder="Select start time"
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="endAt">
                {(field) => (
                  <div className="space-y-2 w-1/3">
                    <Label htmlFor="endAt">End Time</Label>
                    <DateTimePicker
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e?.toString() ?? '')}
                      minDate={new Date()}
                      placeholder="Select end time"
                    />
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
                        <SelectItem value="practise">Practise</SelectItem>
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
                    disabled={!canSubmit || isSubmitting}
                    className="cursor-pointer"
                  >
                    Update Quiz
                  </Button>
                )}
              />
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          <QuizPreview data={formValues} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
