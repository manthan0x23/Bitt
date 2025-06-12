import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { FaStar, FaExclamationTriangle } from 'react-icons/fa';
import type { QuizProblemSchemaT } from '@/lib/types/quiz';

interface QuestionViewProps {
  data: QuizProblemSchemaT;
}

export const QuestionView = ({ data }: QuestionViewProps) => {
  const isIncomplete =
    data.question == null ||
    !data.type ||
    (['multiple_choice', 'multiple_select'].includes(data.type) &&
      (!data.choices || data.choices.length < 2 || data.answer == null)) ||
    (data.type === 'text' &&
      (!data.textAnswer || typeof data.textAnswer !== 'string'));

  if (isIncomplete) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertTitle>Incomplete Problem</AlertTitle>
        <AlertDescription>
          This problem is missing required fields (question, type, choices, or
          answer). Please edit it to proceed.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-1 text-xs"
            >
              <FaStar className="w-3.5 h-3.5 text-primary" />
              {data.points} pts
            </Badge>
            <Badge variant="outline" className="capitalize text-xs">
              {data.difficulty}
            </Badge>
          </div>
        </div>

        <div className="text-xl font-medium leading-relaxed mt-2">
          {data.question}
        </div>
      </div>

      {data.type === 'multiple_choice' && (
        <RadioGroup
          value={String(data.answer)}
          className="flex flex-col gap-4 mt-6"
        >
          {data.choices?.map((choice, i) => (
            <label
              key={i}
              className={cn(
                'flex items-center gap-4 px-6 py-5 rounded-lg border border-muted bg-background hover:border-primary transition text-base',
                data.answer == i && 'border border-primary bg-primary/5',
              )}
            >
              <RadioGroupItem value={String(i)} className="mt-0.5" />
              <span className="text-base font-normal">{choice}</span>
            </label>
          ))}
        </RadioGroup>
      )}

      {data.type === 'multiple_select' && (
        <div className="flex flex-col gap-4 mt-6">
          {data.choices?.map((choice, i) => (
            <label
              key={i}
              className={cn(
                'flex items-center gap-4 px-6 py-5 rounded-lg border border-muted bg-background hover:border-primary transition text-base',
                Array.isArray(data.answer) &&
                  data.answer.includes(i) &&
                  'border border-primary bg-primary/5',
              )}
            >
              <Checkbox
                checked={Array.isArray(data.answer) && data.answer.includes(i)}
                className="mt-0.5"
              />
              <span className="text-base font-normal">{choice}</span>
            </label>
          ))}
        </div>
      )}

      {data.type === 'text' && (
        <Input
          value={data.textAnswer ?? ''}
          readOnly
          className="w-full max-w-xl p-4 mt-6"
        />
      )}

      {data.explanation && (
        <div className="pt-4 text-sm text-muted-foreground">
          <span className="font-semibold">Explanation:</span> {data.explanation}
        </div>
      )}
    </div>
  );
};
