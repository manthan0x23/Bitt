import { useForm, useStore } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  type QuizProblemDifficultyT,
  type QuizProblemSchemaT,
  type QuizProblemTypeT,
} from '@/lib/types/quiz';
import { zUpdateProblemSchema } from '../schema/create-problem';
import type { z } from 'zod/v4';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UpdateQuizProblemsCall,
  type UpdateQuizProblemsCallResponseT,
} from '../server-calls/update-quiz-problem';
import { toast } from 'sonner';
import { useParams, useSearch } from '@tanstack/react-router';

export const QuestionEdit = ({ data }: { data: QuizProblemSchemaT }) => {
  const { stageId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  });
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/quiz/',
  }) satisfies { topic: number; question: number };

  const queries = useQueryClient();
  const form = useForm({
    defaultValues: {
      id: data.id,
      quizId: data.quizId,
      questionIndex: data.questionIndex,
      question: data.question,
      explanation: data.explanation ?? '',
      points: data.points,
      difficulty: data.difficulty,
      type: data.type || 'multiple_choice',
      choices: data.choices ?? [],
      answer: data.answer,
      textAnswer: data.textAnswer ?? '',
    } as z.infer<typeof zUpdateProblemSchema>,
    validators: {
      onBlur: zUpdateProblemSchema,
      onBlurAsync: zUpdateProblemSchema,
      onSubmit: zUpdateProblemSchema,
      onSubmitAsync: zUpdateProblemSchema,
    },
    onSubmit: async ({ value }) => {
      const parsed = zUpdateProblemSchema.safeParse(value);

      if (parsed.success) {
        updateProblemMutation.mutate(parsed.data);
      } else {
        toast.error(parsed.error.message, { richColors: true });
      }
    },
  });

  const formValues = useStore(form.store);

  const updateProblemMutation = useMutation({
    mutationFn: (data: z.infer<typeof zUpdateProblemSchema>) =>
      UpdateQuizProblemsCall(data),

    onMutate: () => {
      toast.loading('Updating Problem', {
        id: 'update_mutation',
        richColors: true,
      });
    },
    onSuccess: ({ data }: { data: UpdateQuizProblemsCallResponseT }) => {
      queries.invalidateQueries({
        queryKey: [
          'admin',
          'stages',
          'quiz',
          'problem',
          search.question,
          'stage',
          stageId,
        ],
      });
      toast.success(data.message, { id: 'update_mutation', richColors: true });
    },
    onError: (e) => {
      toast.error(e.message, {
        id: 'update_mutation',
        richColors: true,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-6 mt-10"
    >
      <form.Field
        name="question"
        children={(field) => (
          <div className="space-y-2">
            <Label
              className={cn(
                field.state.meta.errors.length > 0 && 'text-destructive',
              )}
            >
              Question
            </Label>
            <Textarea
              aria-invalid={field.state.meta.errors.length > 0}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      />

      <form.Field
        name="explanation"
        children={(field) => (
          <div className="space-y-2">
            <Label
              className={cn(
                field.state.meta.errors.length > 0 && 'text-destructive',
              )}
            >
              Explanation
            </Label>
            <Textarea
              aria-invalid={field.state.meta.errors.length > 0}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors && (
              <p className="text-sm text-red-500">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      />

      <div className="flex gap-4">
        <form.Field
          name="points"
          children={(field) => (
            <div className="space-y-2 w-1/3">
              <Label>Points</Label>
              <Input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </div>
          )}
        />

        <form.Field
          name="difficulty"
          children={(field) => (
            <div className="space-y-2 w-1/3">
              <Label>Difficulty</Label>
              <Select
                value={field.state.value}
                onValueChange={(v: QuizProblemDifficultyT) =>
                  field.handleChange(v)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <form.Field
          name="type"
          children={(field) => (
            <div className="space-y-2 w-1/3">
              <Label>Type</Label>
              <Select
                value={field.state.value}
                onValueChange={(v: QuizProblemTypeT) => {
                  field.handleChange(v);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="multiple_select">
                    Multiple Select
                  </SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>

      <form.Field
        name="choices"
        children={(choicesField) => {
          const formType = formValues.values.type;
          const isMCQ = formType === 'multiple_choice';
          const isMSQ = formType === 'multiple_select';
          const isText = formType === 'text';

          if (isText) {
            return (
              <form.Field
                name="textAnswer"
                children={(textField) => (
                  <div className="space-y-2">
                    <Label
                      className={cn(
                        textField.state.meta.errors.length > 0 &&
                          'text-destructive',
                      )}
                    >
                      Text Answer
                    </Label>
                    <Input
                      value={textField.state.value || ''}
                      onBlur={textField.handleBlur}
                      onChange={(e) => textField.handleChange(e.target.value)}
                    />
                    {textField.state.meta.errors && (
                      <p className="text-sm text-red-500">
                        {textField.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              />
            );
          }

          return (
            <div className="space-y-4">
              <Label>Choices</Label>
              {choicesField.state.value.map((choice, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Input
                    className="flex-1"
                    value={choice}
                    onChange={(e) => {
                      const updated = [...choicesField.state.value];
                      updated[index] = e.target.value;
                      choicesField.handleChange(updated);
                    }}
                  />
                  {isMCQ ? (
                    <form.Field
                      name="answer"
                      children={(ansField) => (
                        <input
                          type="radio"
                          value={index}
                          checked={ansField.state.value === index}
                          onChange={() => ansField.handleChange(index)}
                        />
                      )}
                    />
                  ) : (
                    <form.Field
                      name="answer"
                      children={(ansField) => {
                        const currentValue = Array.isArray(ansField.state.value)
                          ? ansField.state.value
                          : [];
                        return (
                          <Checkbox
                            checked={currentValue.includes(index)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...currentValue, index]
                                : currentValue.filter((i) => i !== index);
                              ansField.handleChange(newValue);
                            }}
                          />
                        );
                      }}
                    />
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  choicesField.handleChange([...choicesField.state.value, ''])
                }
              >
                + Add Choice
              </Button>
            </div>
          );
        }}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            Update
          </Button>
        )}
      />
    </form>
  );
};
