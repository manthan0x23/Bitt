import { z } from 'zod';

export const zAdminSchema = z.object({
  id: z.string().min(1),
  name: z.string().max(256).nullable(),
  username: z.string().min(1),

  workEmail: z.string().email(),
  password: z.string().optional(), // usually omitted in responses

  emailVerified: z.boolean(),

  logoUrl: z.string().url().nullable(),

  accountSource: z.string(), // from pgEnum
  role: z.string(), // typically validated in business logic
  roleId: z.string().nullable(),

  createdAt: z.date(),
  isDeleted: z.date().nullable(),
  updatedAt: z.date(),

  organizationId: z.string().nullable(),
});
