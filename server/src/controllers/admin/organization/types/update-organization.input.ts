import { type Request } from "express";
import { z } from "zod/v4";

export const zUpdateOrganizationInput = z.object({
  name: z.string().min(1).nullable(),
  slug: z.string().min(1).nullable(),

  description: z.string().nullable(),
  logoUrl: z.url().nullable(),

  logo: z
    .any()
    .nullable()
    .refine(
      (file) =>
        !file ||
        (typeof file === "object" &&
          file !== null &&
          "mimetype" in file &&
          ["image/png", "image/jpeg", "image/jpg"].includes(
            (file as { mimetype: string }).mimetype
          )),
      {
        message: "Logo must be a PNG, JPEG, or JPG file",
      }
    ),

  origin: z.string().min(1).nullable(),
  startDate: z
    .string()
    .nullable()
    .transform((v) => {
      if (v) return new Date(v);
      else null;
    }),
});
