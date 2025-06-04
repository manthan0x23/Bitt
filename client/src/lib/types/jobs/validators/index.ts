import { z } from 'zod/v4';

export const zJobTypeEnum = z.enum(['internship', 'full-time', 'part-time']);
export const zJobStatusEnum = z.enum(['draft', 'open', 'closed', 'archived']);
export const zScreeningTypeEnum = z.enum([
  'application',
  'single-stage',
  'multi-stage',
]);

export const zJobsSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),

  type: zJobTypeEnum,
  status: zJobStatusEnum.default('draft'),
  screeningType: zScreeningTypeEnum.default('single-stage'),

  endDate: z.iso.date(),

  tags: z.array(z.string()).default([]),

  resumeRequired: z.boolean().default(false),
  coverLetterRequired: z.boolean().default(false),
  isCreationComplete: z.boolean().default(false),

  organizationId: z.string().min(1),

  createdAt: z.coerce.date().default(new Date()),
  updatedAt: z.coerce.date().default(new Date()),
});
