// types/contest/update-contest.input.ts
import { z } from "zod";
import {
  zContestTypeEnum,
  zContestAccessEnum,
  zContestPublishStateEnum,
} from "./create-contest.input";
import { zMinuteDateTime } from "../../../../utils/integrations/date-time";

export const zUpdateContestInput = z
  .object({
    id: z.string().length(6),
    title: z.string().min(1).max(256).optional(),
    description: z.string().optional().nullable(),
    stage: z.number().int().min(1).optional(),
    startAt: zMinuteDateTime.optional(),
    endAt: zMinuteDateTime.optional(),
    duration: z.number().int().min(1).optional(),
    contestType: zContestTypeEnum.optional(),
    accessibility: zContestAccessEnum.optional(),
    availableForPractise: z.boolean().optional(),
    state: zContestPublishStateEnum.optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.startAt && data.endAt) {
        return new Date(data.startAt) < new Date(data.endAt);
      }
      return true;
    },
    {
      message: "End date must be after start date if both are provided",
      path: ["endAt"],
    }
  );
