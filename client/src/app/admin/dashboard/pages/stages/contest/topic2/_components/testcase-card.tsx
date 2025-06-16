import { useForm } from '@tanstack/react-form';
import type { TestcasesSchemaT, TestcasesTypeT } from '@/lib/types/testcases';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { zTestcasesTypeEnum } from '@/lib/types/testcases/validators';
import { zTestcaseFormSchema } from '../schema/problem-testcase';
import type { z } from 'zod/v4';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  testcase: TestcasesSchemaT;
  index: number;
};

export const TestCaseCard = ({ testcase, index }: Props) => {
  const [editMode, setEditMode] = useState(false);

  const form = useForm({
    defaultValues: {
      contestProblemId: testcase.contestProblemId,
      input: {
        file: null,
        text: '',
      },
      output: {
        file: null,
        text: '',
      },
      points: testcase.points,
      type: testcase.type || 'system',
    } as z.infer<typeof zTestcaseFormSchema>,
    validators: {
      onBlur: zTestcaseFormSchema,
      onBlurAsync: zTestcaseFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Submitted testcase update:', value);
      setEditMode(false);
    },
  });

  // 🧠 Load file text into input/output.text if URL provided
  useEffect(() => {
    const loadFiles = async () => {
      if (typeof testcase.input === 'string') {
        try {
          const res = await fetch(testcase.input);
          const text = await res.text();
          form.setFieldValue('input.text', text);
        } catch (e) {
          console.error('Error loading input file:', e);
        }
      }

      if (typeof testcase.output === 'string') {
        try {
          const res = await fetch(testcase.output);
          const text = await res.text();
          form.setFieldValue('output.text', text);
        } catch (e) {
          console.error('Error loading output file:', e);
        }
      }
    };

    loadFiles();
  }, [testcase.input, testcase.output]);

  return (
    <form className="rounded-lg border p-4 space-y-4">
      {/* Header: Testcase index and edit/save */}
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-semibold">Testcase {index}</h3>
        {!editMode ? (
          <Button onClick={() => setEditMode(true)} size="sm" variant="outline">
            Edit
          </Button>
        ) : (
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                size="sm"
                disabled={!canSubmit || isSubmitting}
              >
                Save
              </Button>
            )}
          </form.Subscribe>
        )}
      </div>

      {/* Points & Type */}
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="points">
          {(field) => (
            <div className="space-y-2">
              <Label className={cn(field.state.meta.errors.length && 'text-destructive')}>
                Points
              </Label>
              <Input
                type="number"
                disabled={!editMode}
                value={field.state.value ?? ''}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="type">
          {(field) => (
            <div className="space-y-2">
              <Label className={cn(field.state.meta.errors.length && 'text-destructive')}>
                Type
              </Label>
              <Select
                disabled={!editMode}
                value={field.state.value}
                onValueChange={(v: TestcasesTypeT) => field.handleChange(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {zTestcasesTypeEnum.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
      </div>

      {/* Input & Output */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        {/* Input */}
        <div className="space-y-2">
          <h4 className="font-medium">Input</h4>

          <form.Field name="input.file">
            {(field) => (
              <div className="space-y-2">
                <Label>Input File</Label>
                <Input
                  type="file"
                  disabled={!editMode}
                  accept=".txt"
                  onChange={(e) => field.handleChange(e.target.files?.[0] ?? null)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="input.text">
            {(field) => (
              <div className="space-y-2">
                <Label>Input Text</Label>
                <Textarea
                  disabled={!editMode}
                  placeholder="Input text..."
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <h4 className="font-medium">Output</h4>

          <form.Field name="output.file">
            {(field) => (
              <div className="space-y-2">
                <Label>Output File</Label>
                <Input
                  type="file"
                  disabled={!editMode}
                  accept=".txt"
                  onChange={(e) => field.handleChange(e.target.files?.[0] ?? null)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="output.text">
            {(field) => (
              <div className="space-y-2">
                <Label>Output Text</Label>
                <Textarea
                  disabled={!editMode}
                  placeholder="Output text..."
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>
        </div>
      </div>
    </form>
  );
};
