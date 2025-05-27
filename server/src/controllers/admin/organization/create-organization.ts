import type { Request, Response } from "express";
import { z } from "zod";

const createOrganizationZParser = z.object({
  name: z.string(),
  url: z.string(),
  description: z.string().optional(),
  origin: z.string(),
  billingEmailAddress: z.string().email(),
});

export const createOrganization = (req: Request, res: Response) => {
    
};
