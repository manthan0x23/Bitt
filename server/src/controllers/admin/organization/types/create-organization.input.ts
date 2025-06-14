import { z } from "zod";

export const zCreateOrganizationInput = z.object({
  name: z.string(),
  url: z.string(),
  description: z.string().optional(),
  origin: z.string(),
  billingEmailAddress: z.string().email(),
  startDate: z.string().date(),
});
