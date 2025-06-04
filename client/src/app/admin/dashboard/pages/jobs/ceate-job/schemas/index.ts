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
    .min(10, 'Please provide a job description (min 10 characters).'),
  location: z.string().min(1, 'Please specify a job location.'),
  type: zJobTypeEnum,
  status: zJobStatusEnum.default('open').optional(),
  screeningType: zScreeningTypeEnum,
  tags: z.array(z.string()).default([]),
  endDate: z.iso.datetime('Please specify the application End Date'),
  resumeRequired: z.boolean().default(false),
});
