import { useForm, useStore } from '@tanstack/react-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateStageSchema, type CreateStageSchemaT } from '../schemas';
import {
  zStageSelectionCriteria,
  zStageSelectType,
  zStageTypeEnum,
} from '@/lib/types/stages/validators';
import type {
  StageSelectionCriteriaEnumT,
  StageSelectTypeEnumT,
  StageTypeEnumT,
} from '@/lib/types/stages';
import { twMerge } from 'tailwind-merge';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createJobStageCall,
  type CreateJobStageResponseT,
} from '../server-calls/create-job-stage';
import { toast } from 'sonner';
import { StageTypeRender } from './stage-type-render';
import { cn } from '@/lib/utils';

const InitialFormState: Partial<CreateStageSchemaT> = {
  description: '',
  type: 'contest',
  inflow: 0,
  outflow: 2000,
  selectionCriteria: 'automatic',
  selectType: 'relax',
  startAt: null,
  endAt: null,
};

export const AddStageDialog = ({
  stageIndex,
  jobId,
  open,
  setOpen,
  inflow,
}: {
  stageIndex: number;
  jobId: string;
  open: boolean;
  setOpen: (arg0: boolean) => void;
  inflow?: number;
}) => {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      stageIndex,
      jobId,
      ...InitialFormState,
      inflow: inflow ?? 0,
    },
    validators: {
      onBlur: CreateStageSchema,
    },
    onSubmit: async ({ value }) => {
      const parsed = CreateStageSchema.safeParse(value);
      if (parsed.error) {
        toast.error(parsed.error.message);
        return;
      }

      createStageMutation.mutate(parsed.data);
    },
  });
  const formStore = useStore(form.store);

  const createStageMutation = useMutation({
    mutationFn: (v: CreateStageSchemaT) => createJobStageCall(v),
    onError: (e) => {
      toast.error(e.message);
    },
    onSuccess: ({ data }: { data: CreateJobStageResponseT }) => {
      queryClient.invalidateQueries({
        queryKey: ['admins', 'jobs', 'all', jobId, 'edit'],
      });

      toast.success(data.message);

      form.reset();
      setOpen(false);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <h4>Stage</h4>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            aria-disabled={createStageMutation.isPending}
            className="space-y-4"
          >
            <form.Field name="description">
              {(field) => (
                <div className="space-y-2">
                  <div className="w-full flex items-center justify-between">
                    <Label
                      className={cn(
                        'w-1/2',
                        field.state.meta.errors.length > 0 &&
                          ' text-destructive',
                      )}
                    >
                      Description
                    </Label>
                    <p className="text-sm text-muted-foreground ">
                      {field.state.value?.length}
                      /1000
                    </p>
                  </div>
                  <Textarea
                    rows={4}
                    aria-invalid={field.state.meta.errors.length > 0}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Short description for the stage"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="type">
              {(field) => (
                <div className="space-y-2">
                  <Label
                    className={twMerge(
                      field.state.meta.errors.length > 0 && ' text-destructive',
                    )}
                  >
                    Stage Type
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(v as StageTypeEnumT)
                    }
                  >
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={field.state.meta.errors.length > 0}
                    >
                      <SelectValue placeholder="Stage Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {zStageTypeEnum.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          <StageTypeRender size={2} type={opt} />
                        </SelectItem>
                      ))}
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

            {formStore.values.type != 'resume_filter' && (
              <span className="flex gap-4 items-center justify-center w-full">
                <form.Field name="selectionCriteria">
                  {(field) => (
                    <div className="w-1/2 space-y-2">
                      <Label
                        className={twMerge(
                          field.state.meta.errors.length > 0 &&
                            ' text-destructive',
                        )}
                      >
                        Selection Criteria
                      </Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) =>
                          field.handleChange(v as StageSelectionCriteriaEnumT)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Criteria" />
                        </SelectTrigger>
                        <SelectContent>
                          {zStageSelectionCriteria.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt[0].toLocaleUpperCase() + opt.slice(1)}
                            </SelectItem>
                          ))}
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

                <form.Field name="selectType">
                  {(field) => (
                    <div className="w-1/2 space-y-2">
                      <Label>Select Type</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) =>
                          field.handleChange(v as StageSelectTypeEnumT)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {zStageSelectType.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt[0].toLocaleUpperCase() + opt.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
              </span>
            )}

            <span className="flex gap-4 items-center justify-center w-full">
              <form.Field name="inflow">
                {(field) => (
                  <div className="w-1/2 space-y-2">
                    <Label
                      className={twMerge(
                        field.state.meta.errors.length > 0 &&
                          ' text-destructive',
                      )}
                    >
                      Inflow
                    </Label>
                    <Input
                      aria-invalid={field.state.meta.errors.length > 0}
                      onBlur={field.handleBlur}
                      type="number"
                      value={field.state.value?.toString()}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      readOnly={stageIndex != 1}
                      disabled={stageIndex != 1}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="outflow">
                {(field) => (
                  <div className="w-1/2 space-y-2">
                    <Label
                      className={twMerge(
                        field.state.meta.errors.length > 0 &&
                          ' text-destructive',
                      )}
                    >
                      Outflow
                    </Label>
                    <Input
                      placeholder="Number of Selected candidates"
                      aria-invalid={field.state.meta.errors.length > 0}
                      onBlur={field.handleBlur}
                      type="number"
                      value={field.state.value?.toString()}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
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
            {formStore.values.type != 'resume_filter' && (
              <>
                <form.Field name="startAt">
                  {(field) => (
                    <div className="space-y-2 w-full">
                      <Label>Start At</Label>
                      <DateTimePicker
                        value={
                          field.state.value
                            ? new Date(field.state.value)
                            : undefined
                        }
                        onChange={(date) =>
                          field.handleChange(date ? date.toISOString() : '')
                        }
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="endAt">
                  {(field) => (
                    <div className="space-y-2 w-full">
                      <Label>End At</Label>
                      <DateTimePicker
                        className="w-full"
                        value={
                          field.state.value
                            ? new Date(field.state.value)
                            : undefined
                        }
                        onChange={(date) =>
                          field.handleChange(date ? date.toISOString() : '')
                        }
                      />
                    </div>
                  )}
                </form.Field>
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => {
                  console.log(state.errors);

                  return [state.canSubmit, state.isSubmitting];
                }}
                children={([canSubmit, isSubmitting]) => {
                  return (
                    <Button type="submit" disabled={!canSubmit || isSubmitting}>
                      Create Stage
                    </Button>
                  );
                }}
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
