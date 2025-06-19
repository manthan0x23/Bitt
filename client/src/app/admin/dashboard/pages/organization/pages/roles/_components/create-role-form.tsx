import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useForm, useStore } from '@tanstack/react-form';
import {
  zCreateRoleSchema,
  type CreateRoleSchemaT,
} from '../schemas/create-role-schema';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  colorSchemeBgClassMap,
  colorSchemeEnum,
  type ColorSchemeEnum,
} from '@/integrations/theme/colors/scheme';
import { Badge } from '@/components/ui/badge';
import { MultiSelect } from '@/components/ui/multi-select';
import { capabilities, type Capability } from '@/lib/types/capabilities';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateRoleForm = ({ open, onOpenChange }: Props) => {
  const form = useForm({
    defaultValues: {
      tag: '',
      colorScheme: 'gray',
      capabilities: [],
      isTemplate: true,
    } as CreateRoleSchemaT,
    validators: {
      onBlur: zCreateRoleSchema,
      onBlurAsync: zCreateRoleSchema,
      onSubmit: zCreateRoleSchema,
      onSubmitAsync: zCreateRoleSchema,
    },
    onSubmit({ value }) {
      console.log(value);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div>
          <h4>Create Role</h4>
          <p className="text-muted-foreground text-sm">
            Fill in the details to create a new role.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="w-full h-auto space-y-6"
        >
          <form.Field name="tag">
            {(field) => (
              <div className="space-y-2">
                <Label
                  className={cn(
                    field.state.meta.errors.length > 0 && ' text-destructive',
                  )}
                  htmlFor="tag"
                >
                  Tag
                </Label>
                <Input
                  id="tag"
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
          <form.Field name="capabilities">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="tags">Capabilities</Label>
                <MultiSelect
                  placeholder="Select tags"
                  options={capabilities.map((cap) => ({
                    value: cap,
                    label: cap,
                  }))}
                  variant={'default'}
                  defaultValue={[]}
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v as Capability[])}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="colorScheme">
            {(field) => (
              <div className="space-y-2 w-full">
                <Label htmlFor="type">Color Scheme</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as ColorSchemeEnum)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a job type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px]">
                    {colorSchemeEnum.options.map((color) => (
                      <SelectItem value={color}>
                        <div className="flex justify-start gap-3 items-center capitalize">
                          <div
                            className={cn(
                              colorSchemeBgClassMap[color],
                              'h-3 w-3 rounded-full',
                            )}
                          />
                          {color}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
        </form>
      </DialogContent>
    </Dialog>
  );
};
