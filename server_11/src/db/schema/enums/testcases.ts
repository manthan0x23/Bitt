import { pgEnum } from "drizzle-orm/pg-core";

export const testcasesTypeEnum = pgEnum("test_cases_type_enum", [
  "example",
  "system",
  "hidden",
]);
