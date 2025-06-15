import type {
  ContestProblemDifficultyT,
  ContestProblemSchemaT,
} from '@/lib/types/contests';
import { useForm, useStore } from '@tanstack/react-form';
import {
  zUpdateContestProblemSchema,
  type UpdateContestProblemSchemaT,
} from '../schema/update-contest-problem';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UpdateContestProblemsCall,
  type UpdateContestProblemsCallResponseT,
} from '../server-calls/update-contest-problem-call';
import type { ApiError } from '@/lib/error';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { AlgoTags } from '@/integrations/data/algo-tags';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RxCross2 } from 'react-icons/rx';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { useParams, useSearch } from '@tanstack/react-router';
import type { ContestSearchParamsT } from '@/lib/types/globals';
import { useEffect, useState } from 'react';

type Props = {
  problem: Partial<ContestProblemSchemaT>;
};

const placeholderData = {
  description: `You are given an array \`a_1, a_2, ..., a_n\` consisting of integers from \`0\` to \`9\`.

A subarray \`a_l, a_{l+1}, ..., a_r\` is called **good** if the sum of its elements is equal to its length, i.e.,

\`\`\`
sum_{i=l}^{r} a_i = r - l + 1
\`\`\`

### Example:
If \`a = [1, 2, 0]\`, then the good subarrays are:
- \`a[1..1] = [1]\`
- \`a[2..3] = [2, 0]\`
- \`a[1..3] = [1, 2, 0]\`

Return the total number of good subarrays in the array.`,

  inputDescription: `Input
The first line contains one integer t (1 ≤ t ≤ 1000) — the number of test cases.

Each test case consists of:
- One line with an integer n (1 ≤ n ≤ 10^5) — the length of the array a.
- One line with a string of n decimal digits, where the i-th digit represents aᵢ.

The total sum of n over all test cases does not exceed 10^5.`,

  outputDescription: `Output
For each test case, print one integer — the number of good subarrays of the array a.`,

  constraints: `1 ≤ t ≤ 1000
1 ≤ n ≤ 10^5
0 ≤ aᵢ ≤ 9
The sum of n across all test cases ≤ 10^5`,

  hint: 'You can use a prefix sum and check how often (prefixSum - index) occurred before.',
};

export const ProblemBuilder = ({ problem }: Props) => {
  const queries = useQueryClient();
  const { stageId } = useParams({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  });
  const search = useSearch({
    from: '/admin/_dashboard/jobs_/$jobId/stages_/$stageId/contest/',
  }) satisfies ContestSearchParamsT;
  const [currTags, setCurrTags] = useState<string[]>(problem.tags ?? []);

  const form = useForm({
    defaultValues: {
      id: problem.id,
      problemIndex: search.problem,
      contestId: problem.contestId,

      title: problem.title ?? '',
      description: problem.description ?? '',
      inputDescription: problem.inputDescription ?? '',
      outputDescription: problem.outputDescription ?? '',
      constraints: problem.constraints ?? '',

      hints: problem.hints ?? [],

      partialMarks: problem.partialMarks ?? false,
      timeLimitMs: problem.timeLimitMs ?? 0,
      memoryLimitMb: problem.memoryLimitMb ?? 0,

      points: problem.points ?? 0,
      tags: problem.tags ?? [],
      difficulty: problem.difficulty ?? 'medium',
    } as UpdateContestProblemSchemaT,
    validators: {
      onBlur: zUpdateContestProblemSchema,
    },
    onSubmit: ({ value }) => {
      const parsed = zUpdateContestProblemSchema.safeParse(value);
      if (parsed.error) {
        console.log(parsed.error);

        parsed.error.issues.forEach((issue) => {
          toast.error(issue.message);
        });
      } else updateProblemMutation.mutate(parsed.data);
    },
  });

  const updateProblemMutation = useMutation<
    UpdateContestProblemsCallResponseT,
    ApiError,
    UpdateContestProblemSchemaT
  >({
    mutationFn: async (v) => (await UpdateContestProblemsCall(v)).data,
    onMutate: () => {
      toast.loading(`Processing problem ${problem.problemIndex}`, {
        id: 'update-contest-problem',
      });
    },
    onSuccess: ({ message }) => {
      toast.success(message, {
        id: 'update-contest-problem',
      });
      queries.invalidateQueries({
        queryKey: ['admin', 'stages', 'contest', 'problems', stageId],
      });
      queries.invalidateQueries({
        queryKey: [
          'admin',
          'stages',
          'contest',
          'problems',
          stageId,
          'get',
          search.problem,
        ],
      });
    },
    onError: (e) => {
      toast.error(e.response?.data.error, {
        id: 'update-contest-problem',
      });
    },
  });

  useEffect(() => {
    form.reset();
    setCurrTags(form.getFieldValue('tags'));
  }, [search.problem]);

  return (
    <div className="w-full h-full pt-5">
      <form
        aria-disabled={form.state.isSubmitting}
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          form.handleSubmit();
          return;
        }}
        className="w-full mb-[2rem] space-y-8"
      >
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full text-left"
            >
              <Alert
                variant="default"
                className={`
          flex flex-col justify-start transition-all border border-primary 
          ${canSubmit ? 'cursor-pointer hover:scale-[1.01]' : 'cursor-not-allowed opacity-70'}
        `}
              >
                <AlertTitle>Unsaved Changes</AlertTitle>
                <AlertDescription>
                  Some form values have changed. Click to save the changes.
                </AlertDescription>
              </Alert>
            </button>
          )}
        </form.Subscribe>

        <form.Field name="title">
          {(field) => (
            <div className="space-y-1">
              <Label
                htmlFor="title"
                className={cn(
                  field.state.meta.errors.length > 0 && 'text-destructive',
                )}
              >
                Heading
              </Label>
              <p className="text-sm text-muted-foreground">
                Give problem a heading
              </p>
              <Input
                aria-invalid={field.state.meta.errors.length > 0}
                id="title"
                placeholder={`Magical Transformation`}
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

        <span className="w-full h-auto flex items-center justify-between gap-4">
          <form.Field name="points">
            {(field) => (
              <div className={cn('space-y-1 w-1/3')}>
                <Label
                  htmlFor="title"
                  className={cn(
                    field.state.meta.errors.length > 0 && 'text-destructive',
                  )}
                >
                  Points
                </Label>
                <Input
                  aria-invalid={field.state.meta.errors.length > 0}
                  placeholder="100"
                  min={1}
                  value={field.state.value}
                  type="number"
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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
          <form.Field name="difficulty">
            {(field) => (
              <div className={cn('space-y-1 w-1/3')}>
                <Label
                  htmlFor="title"
                  className={cn(
                    field.state.meta.errors.length > 0 && 'text-destructive',
                  )}
                >
                  Difficulty
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v: ContestProblemDifficultyT) =>
                    field.handleChange(v)
                  }
                >
                  <SelectTrigger
                    aria-invalid={field.state.meta.errors.length > 0}
                    onBlur={field.handleBlur}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select quiz type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="space-y-1 w-1/3">
                <Label
                  className={cn(
                    field.state.meta.errors.length > 0 && 'text-destructive',
                  )}
                  htmlFor="tags"
                >
                  Tags
                </Label>
                <MultiSelect
                  className="w-full"
                  placeholder="Select tags"
                  options={AlgoTags}
                  variant={'default'}
                  maxCount={5}
                  value={field.state.value}
                  defaultValue={currTags}
                  onValueChange={field.handleChange}
                  aria-invalid={field.state.meta.errors.length > 0}
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
        </span>

        <form.Field name="description">
          {(field) => (
            <div className="space-y-1">
              <Label
                className={cn(
                  field.state.meta.errors.length > 0 && 'text-destructive',
                )}
                htmlFor="description"
              >
                Description
              </Label>

              <p className="text-sm text-muted-foreground">
                Write the description here. Markdown is supported.
              </p>

              <Textarea
                className="h-[180px]"
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.errors.length > 0}
                placeholder={placeholderData.description}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />

              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <span className="w-full h-auto flex items-center justify-between gap-4">
          <form.Field name="timeLimitMs">
            {(field) => (
              <div className={cn('space-y-1 w-1/3')}>
                <Label
                  htmlFor="title"
                  className={cn(
                    field.state.meta.errors.length > 0 && 'text-destructive',
                  )}
                >
                  Time Limit
                  <span className="text-muted-foreground">(milliseconds)</span>
                </Label>
                <Input
                  aria-invalid={field.state.meta.errors.length > 0}
                  placeholder="100"
                  min={1}
                  value={field.state.value}
                  type="number"
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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
          <form.Field name="memoryLimitMb">
            {(field) => (
              <div className={cn('space-y-1 w-1/3')}>
                <Label
                  htmlFor="title"
                  className={cn(
                    field.state.meta.errors.length > 0 && 'text-destructive',
                  )}
                >
                  Memory Limit{' '}
                  <span className="text-muted-foreground">(megabytes)</span>
                </Label>
                <Input
                  aria-invalid={field.state.meta.errors.length > 0}
                  placeholder="100"
                  min={1}
                  value={field.state.value}
                  type="number"
                  onChange={(e) => field.handleChange(Number(e.target.value))}
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
          <form.Field name="partialMarks">
            {(field) => (
              <div className={cn('space-y-3 w-1/3')}>
                <Label
                  htmlFor="title"
                  className={cn(
                    field.state.meta.errors.length > 0 && 'text-destructive',
                  )}
                >
                  Partial Marks
                </Label>
                <span
                  className={cn(
                    'space-y-1 w-full',
                    'flex items-center justify-between',
                    field.state.meta.errors.length > 0 && 'text-destructive',
                  )}
                >
                  <p className="text-sm text-muted-foreground text-wrap w-[85%]">
                    Turn on partial marking to grant a portion of the total
                    score when a solution passes some, but not all, test cases.
                    Helpful for evaluating progressive correctness.
                  </p>

                  <Switch
                    checked={!!field.state.value}
                    onCheckedChange={field.handleChange}
                    className="cursor-pointer"
                    onBlur={field.handleBlur}
                  />
                </span>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </span>

        <span className="w-full h-auto flex items-center justify-between gap-4">
          <form.Field name="inputDescription">
            {(field) => (
              <div className="space-y-2 w-1/2">
                <Label
                  className={cn(
                    field.state.meta.errors.length > 0 && 'text-destructive',
                  )}
                  htmlFor="instructions"
                >
                  Input Description
                </Label>
                <p className="text-sm text-muted-foreground">
                  Write the input description here. Markdown is supported.
                </p>
                <Textarea
                  className="h-[200px]"
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                  placeholder={placeholderData.inputDescription}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="outputDescription">
            {(field) => (
              <div className="space-y-2 w-1/2">
                <Label
                  className={cn(
                    field.state.meta.errors.length > 0 && 'text-destructive',
                  )}
                  htmlFor="instructions"
                >
                  Output Description
                </Label>
                <p className="text-sm text-muted-foreground">
                  Write the output description here. Markdown is supported.
                </p>

                <Textarea
                  className="h-[200px]" // or any fixed height you like
                  onBlur={field.handleBlur}
                  aria-invalid={field.state.meta.errors.length > 0}
                  placeholder={placeholderData.outputDescription}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </span>

        <form.Field name="constraints">
          {(field) => (
            <div className="space-y-1">
              <Label
                className={cn(
                  field.state.meta.errors.length > 0 && 'text-destructive',
                )}
                htmlFor="description"
              >
                Constraints
              </Label>

              <p className="text-sm text-muted-foreground">
                Write the problem constraints here. Markdown is supported.
              </p>

              <Textarea
                className="h-[125px]"
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.errors.length > 0}
                placeholder={placeholderData.constraints}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />

              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="hints">
          {(fieldArray) => (
            <div className="space-y-6">
              <div className="space-y-1">
                <Label
                  className={
                    fieldArray.state.meta.errors.length > 0
                      ? 'text-destructive'
                      : ''
                  }
                >
                  Hints
                </Label>
                <p className="text-sm text-muted-foreground">
                  Optional hints for the user. Max 5 hints allowed.
                </p>
              </div>

              {fieldArray.state.value.map((_, index) => (
                <div className="flex items-center justify-start gap-3 w-1/2">
                  <div key={index} className="pl-4  w-[80%]">
                    <form.Field name={`hints[${index}]`}>
                      {(hintField) => (
                        <div className="space-y-2">
                          <Label
                            className={cn(
                              hintField.state.meta.errors.length > 0
                                ? 'text-destructive'
                                : '',
                              'flex items-center justify-between',
                            )}
                          >
                            <p>Hint {index + 1}</p>
                            <button
                              type="button"
                              title="Remove this hint"
                              className="cursor-pointer hover:bg-muted"
                              onClick={() =>
                                fieldArray.handleChange(
                                  fieldArray.state.value.filter(
                                    (_, i) => i !== index,
                                  ),
                                )
                              }
                            >
                              <RxCross2 />
                            </button>
                          </Label>
                          <Textarea
                            placeholder={placeholderData.hint}
                            value={hintField.state.value}
                            onChange={(e) =>
                              hintField.handleChange(e.target.value)
                            }
                            onBlur={hintField.handleBlur}
                          />
                          {hintField.state.meta.errors[0] && (
                            <p className="text-sm text-destructive">
                              {hintField.state.meta.errors[0].message}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>
              ))}

              <Button
                size={'sm'}
                variant={'outline'}
                type="button"
                className="text-sm ml-4 cursor-pointer"
                disabled={fieldArray.state.value.length >= 5}
                onClick={() =>
                  fieldArray.handleChange([...fieldArray.state.value, ''])
                }
              >
                <Plus />
                Add hint
              </Button>

              {fieldArray.state.meta.errors[0] && (
                <p className="text-sm text-destructive">
                  {fieldArray.state.meta.errors[0].message}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </form>
    </div>
  );
};
