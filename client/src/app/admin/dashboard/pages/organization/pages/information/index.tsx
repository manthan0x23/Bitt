import { useMutation, useQuery } from '@tanstack/react-query';
import {
  GetOrganizationCall,
  type GetOrganizationCallResponseT,
} from './server-calls/get-organization-id';
import type { ApiError } from '@/lib/error';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useForm } from '@tanstack/react-form';
import {
  zUpdateOrganizationSchema,
  type UpdateOrganizationSchemaT,
} from './schema/update-organization-metdata-schema';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import {
  UpdateOrganizationCall,
  type UpdateOrganizationCallResponseT,
} from './server-calls/update-organization-metadata';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countryOptions } from '@/integrations/data/countries';

export const OrganizationInfo = () => {
  const [edit, setEdit] = useState(false);

  const organizationQuery = useQuery<GetOrganizationCallResponseT, ApiError>({
    queryKey: ['admin', 'organization', 'my'],
    queryFn: async () => (await GetOrganizationCall()).data,
  });

  const Org = organizationQuery.data?.data;

  const form = useForm({
    defaultValues: {
      name: Org?.name ?? null,
      slug: Org?.slug ?? null,
      description: Org?.description ?? null,
      logoUrl: Org?.logoUrl ?? null,
      logo: null,
      origin: Org?.origin ?? null,
      startDate: Org?.startDate ? new Date(Org.startDate).toISOString() : null,
    } as UpdateOrganizationSchemaT,
    validators: {
      onBlur: zUpdateOrganizationSchema,
      onBlurAsync: zUpdateOrganizationSchema,
      onSubmit: zUpdateOrganizationSchema,
      onSubmitAsync: zUpdateOrganizationSchema,
    },
    onSubmit: ({ value }) => {
      updateOrganizationMutation.mutate(value);
    },
  });

  const updateOrganizationMutation = useMutation<
    UpdateOrganizationCallResponseT,
    ApiError,
    UpdateOrganizationSchemaT
  >({
    mutationFn: async (body) => (await UpdateOrganizationCall(body)).data,
    onMutate: () => {
      toast.loading('Updating organization information...', {
        id: 'update-org-metadata',
      });
    },
    onSuccess: ({ message }) => {
      toast.success(message, {
        id: 'update-org-metadata',
      });
      organizationQuery.refetch();
      setEdit(false);
    },
    onError: (e) => {
      toast.success(e.response?.data.error, {
        id: 'update-org-metadata',
      });
    },
  });

  if (organizationQuery.isLoading) {
    return <Skeleton className="h-full w-full rounded-lg" />;
  }

  return (
    <div className="overflow-x-hidden overflow-y-auto h-full w-full space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (edit) form.handleSubmit();
        }}
        className="w-full space-y-6 mt-5 px-2"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span>
            <h4 className="text-2xl font-bold ">Organization Profile</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your organization's basic information and branding
            </p>
          </span>
          {edit ? (
            <div className="space-x-2">
              <Button
                onClick={() => {
                  form.reset();
                  setEdit(false);
                }}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(s) => [s.canSubmit, s.isSubmitting, s.isDirty]}
                children={([canSubmit, isSubmitting, isDirty]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || !isDirty}
                    size="sm"
                  >
                    {isSubmitting ? 'Updating...' : 'Save Changes'}
                  </Button>
                )}
              />
            </div>
          ) : (
            <Button onClick={() => setEdit(true)} size="sm" variant="outline">
              Edit Profile
            </Button>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Left Section */}
          <div className="w-full lg:w-[80%] space-y-6">
            {edit ? (
              // Edit Mode - Form Fields
              <>
                {/* Name */}
                <div className="w-full flex items-center justify-center gap-4">
                  <form.Field name="name">
                    {(field) => (
                      <div className="space-y-2 w-1/2">
                        <Label
                          className={cn(
                            field.state.meta.errors.length &&
                              'text-destructive',
                          )}
                          htmlFor="name"
                        >
                          Organization Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter organization name"
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors[0] && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors[0].message}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  {/* Slug */}
                  <form.Field name="slug">
                    {(field) => (
                      <div className="space-y-2 w-1/2">
                        <Label
                          className={cn(
                            field.state.meta.errors.length &&
                              'text-destructive',
                          )}
                          htmlFor="slug"
                        >
                          URL Slug
                        </Label>
                        <Input
                          id="slug"
                          placeholder="organization-slug"
                          value={field.state.value ?? ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors[0] && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors[0].message}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Description */}
                <form.Field name="description">
                  {(field) => (
                    <div className="space-y-2">
                      <Label
                        className={cn(
                          field.state.meta.errors.length && 'text-destructive',
                        )}
                        htmlFor="description"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your organization..."
                        value={field.state.value ?? ''}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        rows={4}
                      />
                      {field.state.meta.errors[0] && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0].message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <div className="w-full flex items-center justify-center gap-4">
                  {/* Origin */}
                  <form.Field name="origin">
                    {(field) => (
                      <div className="space-y-2 w-1/2">
                        <Label
                          className={cn(
                            field.state.meta.errors.length &&
                              'text-destructive',
                          )}
                          htmlFor="origin"
                        >
                          Origin Country
                        </Label>

                        <Select
                          value={field.state.value ?? ''}
                          onValueChange={field.handleChange}
                          disabled={!edit}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] max-w-full">
                            {countryOptions.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="text-xl">
                                    {country.flag}
                                  </span>
                                  <span>{country.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {field.state.meta.errors[0] && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors[0].message}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  {/* Start Date */}
                  <form.Field name="startDate">
                    {(field) => (
                      <div className="space-y-2 w-1/2">
                        <Label
                          className={cn(
                            field.state.meta.errors.length &&
                              'text-destructive',
                          )}
                          htmlFor="startDate"
                        >
                          Founded Date
                        </Label>
                        <DateTimePicker
                          pickTime={false}
                          value={new Date(field.state.value ?? '')}
                          onChange={(d) =>
                            field.handleChange(
                              d ? new Date(d).toISOString() : null,
                            )
                          }
                        />
                        {field.state.meta.errors[0] && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors[0].message}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
              </>
            ) : (
              <div className="space-y-6 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Organization Name</p>
                    <p className="font-medium">{Org?.name || 'Not set'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">URL Slug</p>
                    <p className="font-medium">{Org?.slug || 'Not set'}</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Description</p>
                  <p className="h-auto text-wrap">
                    {Org?.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Origin</p>
                    {Org?.origin ? (
                      (() => {
                        const originCountry = countryOptions.find(
                          (c) => c.value === Org.origin,
                        );
                        return originCountry ? (
                          <p className="font-medium flex items-center gap-2">
                            <span className="text-lg">
                              {originCountry.flag}
                            </span>
                            <span className='font-medium'>{originCountry.label}</span>
                          </p>
                        ) : (
                          <p className="font-medium text-accent">Unknown</p>
                        );
                      })()
                    ) : (
                      <p className="font-medium text-accent">Not set</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Founded</p>
                    <p className="text-sm">
                      {Org?.startDate &&
                        new Date(Org?.startDate).toDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Logo Section */}
          <div className="w-full lg:w-[20%] flex flex-col items-center">
            {edit ? (
              <div className="border rounded-lg p-2 w-full">
                <form.Field name="logo">
                  {(field) => (
                    <div className="space-y-3 w-full">
                      <div className="aspect-square w-full  border-dashed rounded-lg overflow-hidden border">
                        <img
                          src={
                            field.state.value
                              ? URL.createObjectURL(field.state.value)
                              : (Org?.logoUrl ?? '')
                          }
                          alt="Organization logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) =>
                          field.handleChange(e.target.files?.[0] ?? null)
                        }
                        onBlur={field.handleBlur}
                        className="text-sm"
                      />
                      {field.state.meta.errors[0] && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0].message}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>
            ) : (
              // View Mode - Logo Display
              <div className="w-full">
                <div className="aspect-square w-full border rounded-lg overflow-hidden shadow-sm p-2">
                  {Org?.logoUrl ? (
                    <img
                      src={Org.logoUrl}
                      alt="Organization logo"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center">
                          <span className="text-xl">🏢</span>
                        </div>
                        <p className="text-sm">No logo</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
