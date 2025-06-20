import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useForm, useStore } from '@tanstack/react-form';
import {
  zCreateOrganizationInviteSchema,
  type CreateOrganizationInviteSchemaT,
} from '../schema/create-invite-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateOrganizationInviteCall,
  type CreateOrganizationInviteCallResponseT,
} from '../server-calls/create-org-invite';
import type { ApiError } from '@/lib/error';
import { toast } from 'sonner';
import type { RoleSchemaT } from '@/lib/types/roles';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import MultiSelect from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';
import {
  colorSchemeEnum,
  colorSchemeBgClassMap,
  type ColorSchemeEnum,
} from '@/integrations/theme/colors/scheme';
import { capabilities, type Capability } from '@/lib/types/capabilities';
import { zOrganizationInviteTypeEnum } from '@/lib/types/organization-invite/validators';
import { cn } from '@/lib/utils';
import type { OrganizationInviteType } from '@/lib/types/organization-invite';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Badge } from '@/components/ui/badge';
import { TagsInput } from '@/components/ui/tag-input';
import { Sheet, SheetContent } from '@/components/ui/sheet';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: RoleSchemaT[];
};

export const CreateInviteForm = ({ open, onOpenChange, roles }: Props) => {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      allowedOrigins: [],
      inviteType: 'open-for-all',
      roleId: null,
      usageLimit: 10,
      endDate: null,
      roleType: 'template',

      roleTag: null,
      roleCapabilities: null,
      roleColorScheme: null,
      roleIsTemplate: null,
    } as CreateOrganizationInviteSchemaT,
    validators: {
      onBlur: zCreateOrganizationInviteSchema,
      onBlurAsync: zCreateOrganizationInviteSchema,
      onSubmit: zCreateOrganizationInviteSchema,
      onSubmitAsync: zCreateOrganizationInviteSchema,
    },
    onSubmit: ({ value }) => {
      createInviteMutation.mutate(value);
    },
  });

  const formStore = useStore(form.store);

  const createInviteMutation = useMutation<
    CreateOrganizationInviteCallResponseT,
    ApiError,
    CreateOrganizationInviteSchemaT
  >({
    mutationFn: async (body) => (await CreateOrganizationInviteCall(body)).data,
    onMutate: () =>
      toast.loading('Creating invite...', { id: 'create-invite' }),
    onSuccess: ({ message }) => {
      toast.success(message, { id: 'create-invite' });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'organization', 'invites'],
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (e) => {
      toast.error(e.response?.data.error ?? 'Failed to create invite', {
        id: 'create-invite',
      });
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-5 overflow-y-scroll">
        <div className="space-y-1">
          <h4>Create Invite</h4>
          <p className="text-muted-foreground text-sm">
            Provide the necessary details to invite someone to your
            organization.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6 w-full h-auto"
        >
          {/* Invite Type */}

          {/* Allowed Origins (if strict) */}
          <form.Field name="allowedOrigins">
            {(field) => (
              <div
                className={cn(
                  field.state.meta.errors.length > 0 &&
                    ' text-destructive space-y-1',
                )}
                onBlur={field.handleBlur}
              >
                <Label>Allowed Emails</Label>
                <p
                  className={cn(
                    'text-muted-foreground text-xs mb-2',
                    field.state.meta.errors.length > 0 && ' text-destructive ',
                  )}
                >
                  Add one or more allowed email addresses if invite type is
                  strict.
                </p>
                <TagsInput
                  aria-invalid={field.state.meta.errors.length > 0}
                  placeholder="Enter emails, e.g. example@domain.com"
                  value={field.state.value}
                  onChange={field.handleChange}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="inviteType">
            {(field) => (
              <div className="space-y-1 w-full">
                <Label>Invite Type</Label>
                <p className="text-muted-foreground text-xs">
                  Specify how the invite can be used by the recipient.
                </p>
                <Select
                  aria-invalid={field.state.meta.errors.length > 0}
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as OrganizationInviteType)
                  }
                >
                  <SelectTrigger onBlur={field.handleBlur} className="w-full">
                    <SelectValue placeholder="Select invite type" />
                  </SelectTrigger>
                  <SelectContent>
                    {zOrganizationInviteTypeEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.split('-').join(' ')}
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

          {/* Usage Limit */}
          <form.Field name="usageLimit">
            {(field) => (
              <div className="space-y-1 w-full">
                <Label
                  className={cn(
                    field.state.meta.errors.length > 0 &&
                      ' text-destructive space-y-1',
                  )}
                >
                  Usage Limit
                </Label>
                <p
                  className={cn(
                    'text-xs text-muted-foreground',
                    field.state.meta.errors.length > 0 &&
                      ' text-destructive space-y-1',
                  )}
                >
                  Limit the number of times this invite can be used.
                </p>
                <Input
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(+e.target.value)}
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

          <form.Field name="endDate">
            {(field) => (
              <div className="space-y-1  w-full" onBlur={field.handleBlur}>
                <Label
                  className={cn(
                    field.state.meta.errors.length > 0 &&
                      ' text-destructive space-y-1',
                  )}
                >
                  Expires on
                </Label>
                <p
                  className={cn(
                    'text-xs text-muted-foreground',
                    field.state.meta.errors.length > 0 &&
                      ' text-destructive space-y-1',
                  )}
                >
                  Optional expiry date after which the invite becomes invalid.
                </p>
                <DateTimePicker
                  aria-invalid={field.state.meta.errors.length > 0}
                  value={
                    field.state.value ? new Date(field.state.value) : undefined
                  }
                  onChange={(d) => {
                    if (d) field.handleChange(new Date(d).toISOString());
                  }}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="roleType">
            {(field) => (
              <div className="space-y-1 w-full">
                <Label
                  className={cn(
                    field.state.meta.errors.length > 0 &&
                      ' text-destructive space-y-1',
                  )}
                >
                  Role Type
                </Label>
                <p
                  className={cn(
                    'text-xs text-muted-foreground',
                    field.state.meta.errors.length > 0 &&
                      ' text-destructive space-y-1',
                  )}
                >
                  Choose between a predefined role or define a custom one.
                </p>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as 'custom' | 'template')
                  }
                >
                  <SelectTrigger
                    aria-invalid={field.state.meta.errors.length > 0}
                    onBlur={field.handleBlur}
                    className="w-full"
                  >
                    <SelectValue placeholder="Select role type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
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

          {/* If template, select existing role */}
          {formStore.values.roleType === 'template' && (
            <form.Field name="roleId">
              {(field) => (
                <div className="space-y-1">
                  <Label
                    className={cn(
                      field.state.meta.errors.length > 0 &&
                        ' text-destructive space-y-1',
                    )}
                  >
                    Select Role
                  </Label>
                  <Select
                    value={field.state.value ?? ''}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger
                      aria-invalid={field.state.meta.errors.length > 0}
                      onBlur={field.handleBlur}
                      className="w-full"
                    >
                      <SelectValue placeholder="Choose a template role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <Badge
                            className={cn(
                              colorSchemeBgClassMap[role.colorScheme],
                              'text-white dark:text-white rounded-xl px-2',
                            )}
                          >
                            {role.tag}
                          </Badge>
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
          )}

          {/* If custom, show role fields */}
          {form.state.values.roleType === 'custom' && (
            <>
              <form.Field name="roleTag">
                {(field) => (
                  <div className="space-y-1 w-full">
                    <Label
                      className={cn(
                        field.state.meta.errors.length > 0 &&
                          ' text-destructive',
                      )}
                      htmlFor="tag"
                    >
                      Tag
                    </Label>
                    <p
                      className={cn(
                        'text-xs text-muted-foreground',
                        field.state.meta.errors.length > 0 &&
                          ' text-destructive',
                      )}
                    >
                      Short name for the role, e.g., "Scout", "Admin".
                    </p>
                    <Input
                      id="tag"
                      minLength={2}
                      placeholder="e.g., Moderator"
                      value={field.state.value ?? ''}
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
              <form.Field name="roleColorScheme">
                {(field) => (
                  <div className="space-y-1 w-full">
                    <Label
                      className={cn(
                        field.state.meta.errors.length > 0 &&
                          ' text-destructive',
                      )}
                      htmlFor="type"
                    >
                      Color Scheme
                    </Label>
                    <p
                      className={cn(
                        'text-xs text-muted-foreground',
                        field.state.meta.errors.length > 0 &&
                          ' text-destructive',
                      )}
                    >
                      Select a color to visually represent this role.
                    </p>
                    <Select
                      value={field.state.value ?? undefined}
                      onValueChange={(v) =>
                        field.handleChange(v as ColorSchemeEnum)
                      }
                    >
                      <SelectTrigger
                        aria-invalid={field.state.meta.errors.length > 0}
                        onBlur={field.handleBlur}
                        className="w-full"
                      >
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
              </form.Field>{' '}
              <form.Field name="roleCapabilities">
                {(field) => (
                  <div className="space-y-1 w-full">
                    <Label
                      className={cn(
                        field.state.meta.errors.length > 0 &&
                          ' text-destructive',
                      )}
                      htmlFor="tags"
                    >
                      Capabilities
                    </Label>
                    <p
                      className={cn(
                        'text-xs text-muted-foreground',
                        field.state.meta.errors.length > 0 &&
                          ' text-destructive',
                      )}
                    >
                      Define what actions this role is allowed to perform.
                    </p>
                    <MultiSelect
                      className="max-h-[80px] overflow-y-scroll"
                      placeholder="Select tags"
                      options={capabilities.map((cap) => ({
                        value: cap,
                        label: cap,
                      }))}
                      value={field.state.value?.map((cap) => ({
                        value: cap,
                        label: cap,
                      }))}
                      onChange={(e) =>
                        field.handleChange(
                          e.map((e) => e.value) as Capability[],
                        )
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
              <form.Field name="roleIsTemplate">
                {(field) => (
                  <div className="w-full flex justify-between items-center">
                    <div className="space-y-1 w-3/4">
                      <Label htmlFor="resume-required">Template</Label>
                      <p className="text-xs text-muted-foreground text-wrap w-[95%]">
                        Enable if this role should be saved as a reusable
                        template for future use.
                      </p>
                    </div>
                    <Switch
                      id="cover-letter-required"
                      checked={field.state.value ?? undefined}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </form.Field>
            </>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <div className="flex gap-2 items-center justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(c) => [c.canSubmit, c.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    Create Invite
                  </Button>
                )}
              />
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
