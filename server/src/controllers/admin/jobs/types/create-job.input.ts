import { z } from "zod";

export const zJobTypeEnum = z.enum(["internship", "full-time", "part-time"]);
export const zJobStatusEnum = z.enum(["draft", "open", "closed", "archived"]);
export const zScreeningTypeEnum = z.enum([
  "manual",
  "auto-cutoff",
  "multi-stage",
]);

export const zCreateJobInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  type: zJobTypeEnum,
  status: zJobStatusEnum.default("draft"),
  screeningType: zScreeningTypeEnum.default("manual"),
  tags: z.array(z.string()).default([]),
});
