import { z } from "zod";

export const zJoinOrganizationInput = z
  .object({
    link: z.string().url().optional(),
    code: z.string().optional(),
  })
  .refine((data) => data.link || data.code, {
    message: "Either invite link or code must be provided.",
    path: ["code"],
  })
  .refine((data) => (!data.link && (!data.code || data.code.length)) === 8, {
    message: "Invite code must be exactly 8 characters if provided.",
    path: ["code"],
  });
