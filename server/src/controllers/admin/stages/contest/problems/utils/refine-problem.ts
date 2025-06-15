import { z } from "zod/v4";

export const ContestProblemDifficulty = z.enum(["easy", "medium", "hard"]);

export const problemExampleSchema = z.array(
  z.object({
    input: z.string(),
    output: z.string(),
  })
);

export const problemSchema = z.object({
  id: z.string().min(1, "ID is required."),
  problemIndex: z.number("Problem index is required."),
  contestId: z.string().min(1, "Contest ID is required."),

  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  inputDescription: z.string().min(1, "Input description is required."),
  outputDescription: z.string().min(1, "Output description is required."),
  constraints: z.string().min(1, "Constraints are required."),

  hints: z.array(z.string()),

  tags: z.array(z.string()).min(1, "At least one tag is required"),

  difficulty: ContestProblemDifficulty.default("medium"),

  points: z.number().int().positive("Points must be a positive integer."),

  timeLimitMs: z
    .number()
    .int()
    .nonnegative("Time Limit must be a positive integer."),
  memoryLimitMb: z
    .number()
    .int()
    .nonnegative("Memory Limit must be a positive integer."),

  authorId: z.array(z.string()).default([]),
  partialMarks: z.boolean().default(false),
  createdAt: z.any().optional(),
  deletedAt: z.any().optional(),
});
