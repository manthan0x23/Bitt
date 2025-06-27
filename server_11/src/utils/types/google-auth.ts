import { z } from "zod";

export const googleJwtPayloadSchema = z.object({
  iss: z.string().url().optional(),
  azp: z.string().optional(),
  aud: z.string().optional(),
  sub: z.string().optional(),
  email: z.string().email(),
  email_verified: z
    .union([z.string(), z.boolean()])
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : val
    ),
  at_hash: z.string().optional(),
  name: z.string().optional(),
  picture: z.string().url().optional(),
  given_name: z.string().optional().optional(),
  family_name: z.string().optional().optional(),
  iat: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .optional(),
  exp: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .optional(),
  alg: z.string().optional(),
  kid: z.string().optional(),
  typ: z.string().optional(),
});
