import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useForm } from '@tanstack/react-form';
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
import MultiSelect from '@/components/ui/multi-select';
import { capabilities, type Capability } from '@/lib/types/capabilities';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateOrgRoleCall,
  type CreateOrgRoleCallResponseT,
} from '../server-calls/create-org-role';
import type { ApiError } from '@/lib/error';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateRoleForm = ({ open, onOpenChange }: Props) => {
  const queries = useQueryClient();
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
      createRoleMutation.mutate(value);
    },
  });

  const createRoleMutation = useMutation<
    CreateOrgRoleCallResponseT,
    ApiError,
    CreateRoleSchemaT
  >({
    mutationFn: async (body) => (await CreateOrgRoleCall(body)).data,
    onMutate: () => {
      toast.loading('Creating role....', {
        id: 'create-role',
      });
    },
    onSuccess: ({ message }) => {
      toast.success(message, {
        id: 'create-role',
      });
      queries.invalidateQueries({
        queryKey: ['admin', 'organization', 'roles', 'all'],
      });
      form.reset();
      onOpenChange(false);
    },
    onError: ({ response }) => {
      toast.error(response?.data.error, {
        id: 'create-role',
      });
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
          <div className="flex items-start  gap-4 justify-between">
            <form.Field name="tag">
              {(field) => (
                <div className="space-y-1 w-1/2">
                  <Label
                    className={cn(
                      field.state.meta.errors.length > 0 && ' text-destructive',
                    )}
                    htmlFor="tag"
                  >
                    Tag
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Short name for the role, e.g., "Scout", "Admin".
                  </p>
                  <Input
                    id="tag"
                    minLength={2}
                    placeholder="e.g., Moderator"
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
            <form.Field name="colorScheme">
              {(field) => (
                <div className="space-y-1 w-1/2">
                  <Label htmlFor="type">Color Scheme</Label>
                  <p className="text-xs text-muted-foreground">
                    Select a color to visually represent this role.
                  </p>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(v as ColorSchemeEnum)
                    }
                  >
                    <SelectTrigger onBlur={field.handleBlur} className="w-full">
                      <SelectValue placeholder="Select a identifying color" />
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
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
          <form.Field name="capabilities">
            {(field) => (
              <div className="space-y-1 w-full">
                <Label htmlFor="tags">Capabilities</Label>
                <p className="text-xs text-muted-foreground">
                  Define what actions this role is allowed to perform.
                </p>
                <MultiSelect
                  className="max-h-[200px] overflow-y-scroll"
                  placeholder="Select tags"
                  options={capabilities.map((cap) => ({
                    value: cap,
                    label: cap,
                  }))}
                  value={field.state.value.map((cap) => ({
                    value: cap,
                    label: cap,
                  }))}
                  onChange={(e) =>
                    field.handleChange(e.map((e) => e.value) as Capability[])
                  }
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

          <div className="w-full flex justify-between items-center">
            <form.Field name="isTemplate">
              {(field) => (
                <div className="space-y-1 w-[70%]">
                  <Label htmlFor="resume-required">Template</Label>
                  <p className="text-xs text-muted-foreground text-wrap w-[95%]">
                    Enable if this role should be saved as a reusable template
                    for future use.
                  </p>
                  <Switch
                    id="cover-letter-required"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </form.Field>
            <div className="flex items-center justify-between gap-2">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.reset();
                  onOpenChange(false);
                }}
                type="reset"
                size={'sm'}
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    size={'sm'}
                    disabled={!canSubmit || isSubmitting}
                    type="submit"
                    className="cursor-pointer"
                  >
                    Create
                  </Button>
                )}
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
