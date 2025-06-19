import { z } from 'zod/v4';

export const zUpdateOrganizationSchema = z.object({
  name: z.string().min(1).nullable(),
  slug: z.string().min(1).nullable(),

  description: z.string().nullable(),
  logoUrl: z.url().nullable(),

  logo: z
    .file()
    .nullable()
    .refine(
      (file) =>
        !file || ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type),
      {
        message: 'Logo must be a PNG, JPEG, or JPG file',
      },
    ),

  origin: z.string().min(1).nullable(),
  startDate: z.string().nullable(),
});

export type UpdateOrganizationSchemaT = z.infer<
  typeof zUpdateOrganizationSchema
>;
