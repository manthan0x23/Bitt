import { z } from "zod/v4";

export const zJobTypeEnum = z.enum(["internship", "full-time", "part-time"]);
export const zJobStatusEnum = z.enum(["draft", "open", "closed", "archived"]);
export const zScreeningTypeEnum = z.enum(["application", "multi-stage"]);

export const zCreateJobInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  type: zJobTypeEnum,
  status: zJobStatusEnum.default("draft"),
  screeningType: zScreeningTypeEnum,
  tags: z.array(z.string()).default([]),
  endDate: z.string().transform((d) => new Date(d)),
  resumeRequired: z.boolean().default(false),
  coverLetterRequired: z.boolean().default(false),
  experience: z.number().default(0),
  openings: z.number().default(1),
});
