import {
  zJobStatusEnum,
  zJobTypeEnum,
  zScreeningTypeEnum,
} from '@/lib/types/jobs/validators';
import { z } from 'zod/v4';

export const CreateJobFormSchema = z.object({
  title: z.string().min(1, 'Please enter a title for the job.'),
  slug: z.string().min(1),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .refine((val) => val.split(/\s+/).filter(Boolean).length <= 400, {
      message: 'Description must be 400 words or fewer',
    }),

  location: z.string().min(1, 'Please specify a job location.'),
  type: zJobTypeEnum,
  status: zJobStatusEnum.default('open').optional(),
  screeningType: zScreeningTypeEnum,
  tags: z.array(z.string()).default([]),
  resumeRequired: z.boolean().default(true),
  coverLetterRequired: z.boolean().default(true),
  experience: z.number(),

  endDate: z.string(),
  openings: z.number().default(1),
});
