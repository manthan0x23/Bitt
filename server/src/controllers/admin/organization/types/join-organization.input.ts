import { z } from "zod/v4";

export const zJoinOrganizationInput = z
  .object({
    link: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
  })
  .check((ctx) => {
    if (!ctx.value.code && !ctx.value.link) {
      ctx.issues.push({
        code: "invalid_format",
        path: ["link", "code"],
        input: ctx.value.link ?? ctx.value.code ?? "",
        format: "url or code",
        values: [],
        message: "Either link or join code must be provided",
      });
    }

    if (ctx.value.code && ctx.value.code.length != 6) {
      ctx.issues.push({
        code: "invalid_value",
        path: ["code"],
        input: ctx.value.code ?? "",
        format: "url or code",
        values: [],
        message: "Join code must be of length 6",
      });
    }

    const urlParse = z.url().safeParse(ctx.value.link);
    if (ctx.value.link && urlParse.error) {
      ctx.issues.push({
        code: "invalid_value",
        path: ["code"],
        input: ctx.value.code ?? "",
        format: "url or code",
        values: [],
        message: urlParse.error.message,
      });
    }
  });
