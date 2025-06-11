import z from "zod/v4";

export const quizTypeEnum = z.enum([
  "live",
  "take-home",
  "practise",
  "upsolve",
]);
export const quizStatusEnum = z.enum(["draft", "open", "closed", "archived"]);
export const quizStateEnum = z.enum(["public", "private", "invite-only"]);

export const quizSchema = z.object({
  id: z.string().max(256).optional(),
  title: z.string().max(255).optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),

  stageId: z.string().max(255),

  startAt: z.coerce.date().optional(),
  duration: z.number().nonnegative().optional(),
  endAt: z.coerce.date().optional(),

  quizType: quizTypeEnum.default("live"),
  state: quizStatusEnum.default("draft"),
  accessibility: quizStateEnum.default("public"),

  noOfQuestions: z.number().nonnegative().min(2),
  tags: z.array(z.string()).default([]),

  requiresVideoMonitoring: z.boolean().default(false),
  requiresAudioMonitoring: z.boolean().default(false),
  requiresAIMonitoring: z.boolean().default(false),
  requiresScreenMonitoring: z.boolean().default(false),
  availableForPractise: z.boolean().default(false),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const zUpdateQuizInput = quizSchema.partial().extend({
  stageId: z.string().max(32),
});
