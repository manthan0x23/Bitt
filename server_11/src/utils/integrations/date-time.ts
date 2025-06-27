import { z } from "zod";

export const minutePrecisionDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const zMinuteDateTime = z
  .string()
  .regex(minutePrecisionDateTimeRegex, "Invalid datetime format")
  .refine((val) => !isNaN(Date.parse(val)), "Invalid datetime value");
