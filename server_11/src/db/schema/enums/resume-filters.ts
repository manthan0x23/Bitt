import { pgEnum } from "drizzle-orm/pg-core";

export const resumeFiltersEnum = pgEnum("resume_filters_type_enum", [
  "ai",
  "manual",
  "hybrid",
]);
