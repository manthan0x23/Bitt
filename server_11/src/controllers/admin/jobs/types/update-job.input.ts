import { z } from "zod/v4";
import {
  zJobStatusEnum,
  zJobTypeEnum,
  zScreeningTypeEnum,
} from "./create-job.input";

export const zUpdateJobInput = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  type: zJobTypeEnum.optional(),
  status: zJobStatusEnum.optional(),
  screeningType: zScreeningTypeEnum.optional(),
  tags: z.array(z.string()).optional(),
  experience: z.number().optional(),
});
