import { z } from 'zod/v4';

export const zOrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),

  description: z.string().nullable(), // Optional in DB, so nullable
  logoUrl: z.string().nullable(),

  billingEmailAddress: z.string(),
  billingEmailVerified: z.boolean(),

  origin: z.string(),
  startDate: z.date().nullable(), // `date` returns string (e.g., "2024-06-19")

  createdAt: z.date(), // `timestamp` returns ISO string
  updatedAt: z.date(),

  createdBy: z.string(),
});
