import z from "zod/v4";

export const zUpdateContestInput = z
  .object({
    id: z.string().min(1, "Contest ID is required for update"),

    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().optional(),
    instructions: z.string().optional(),

    stageId: z.string().optional(),
    isIndependent: z.boolean().default(false),

    startAt: z.string().pipe(z.transform((v) => new Date(v ?? ""))),
    endAt: z.string().pipe(z.transform((v) => new Date(v ?? ""))),

    duration: z
      .number()
      .nonnegative()
      .min(30, "Duration must be minimum 30 minutes"),

    contestType: z.enum(["live", "assignment", "practise"]),
    accessibility: z.enum(["public", "private", "invite-only"]),
    state: z.enum(["draft", "open", "closed", "archived"]),

    warnings: z.array(z.string()).default([]),
    noOfProblems: z.number().nonnegative(),

    requiresVideoMonitoring: z.boolean().optional(),
    requiresAudioMonitoring: z.boolean().optional(),
    requiresAIMonitoring: z.boolean().optional(),
    requiresScreenMonitoring: z.boolean().optional(),
    availableForPractise: z.boolean().optional(),
  })
  .check((ctx) => {
    if (!ctx.value.isIndependent && !ctx.value.stageId) {
      ctx.issues.push({
        code: "custom",
        message:
          "Either contest would be independent or must be linked with a stageId",
        input: ctx.value.stageId,
        path: ["stageId"],
      });
    }

    if (ctx.value.contestType == "live") {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      const startAt = new Date(ctx.value.startAt);
      if (startAt < oneHourFromNow) {
        ctx.issues.push({
          code: "custom",
          message: "Contest must be scheduled at least 1 hour from now",
          input: ctx.value.startAt,
          path: ["startAt"],
        });
      }
    } else {
      if (ctx.value.endAt <= ctx.value.startAt) {
        ctx.issues.push({
          code: "custom",
          message: "End time must be after Start time",
          path: ["endAt"],
          input: ctx.value.endAt,
        });
      }

      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      const startAt = new Date(ctx.value.startAt);
      const endAt = new Date(ctx.value.endAt);
      if (startAt < oneHourFromNow) {
        ctx.issues.push({
          code: "custom",
          message: "Contest must be scheduled at least 1 hour from now",
          input: ctx.value.startAt,
          path: ["startAt"],
        });
      }

      if (!ctx.value.endAt) {
        ctx.issues.push({
          code: "invalid_value",
          message: "End date for the contest must be specified if its not live",
          input: ctx.value.endAt,
          values: ["not_null"],
          path: ["endAt"],
        });
      }

      const minDurationMs = (ctx.value.duration || 0) * 60 * 1000;
      if (endAt.getTime() - startAt.getTime() < minDurationMs) {
        ctx.issues.push({
          code: "custom",
          message: `There must be at least ${ctx.value.duration} minutes between start and end times`,
          path: ["endAt"],
          input: ctx.value.endAt,
        });
      }
    }
  });
