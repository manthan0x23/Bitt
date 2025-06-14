import { z } from "zod/v4";
import { problemSchema } from "../utils/refine-problem";

export const zUpdateProblemInput = problemSchema.omit({
  createdAt: true,
  deletedAt: true,
  authorId: true,
});

export type UpdateProblemSchemaT = z.infer<typeof zUpdateProblemInput>;
