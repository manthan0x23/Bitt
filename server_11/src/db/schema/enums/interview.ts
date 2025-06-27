import { pgEnum } from "drizzle-orm/pg-core";

export const interviewTypeEnum = pgEnum("interview_type_enum", [
  "ai",
  "manual",
]);
