// types/contest-types.ts (or similar shared location)
import { z } from "zod";
import { zMinuteDateTime } from "../../../../utils/integrations/date-time";

export const zContestTypeEnum = z.enum([
  "live",
  "take-home",
  "practise",
  "upsolve",
]);
export const zContestAccessEnum = z.enum(["public", "private", "invite-only"]);
export const zContestPublishStateEnum = z.enum([
  "draft",
  "archived",
  "open",
  "closed",
]);

export const zCreateContestInput = z
  .object({
    title: z.string().min(1, "Title is required.").max(256),
    description: z.string().optional(),
    stage: z.number().int().min(1, "Stage must be at least 1."),
    jobId: z.string().min(1, "Job ID is required."),
    startAt: zMinuteDateTime,
    endAt: zMinuteDateTime,
    duration: z
      .number()
      .int()
      .min(30, "Duration must be at least 30 minutes.")
      .default(90),
    contestType: zContestTypeEnum.default("live"),
    accessibility: zContestAccessEnum.default("public"),
    availableForPractise: z.boolean().default(true),
    publishState: zContestPublishStateEnum.default("draft"),
  })
  .refine((data) => new Date(data.startAt) < new Date(data.endAt), {
    message: "End date must be after start date",
    path: ["endAt"],
  });
