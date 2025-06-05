import { pgEnum } from "drizzle-orm/pg-core";

export const stageTypeEnum = pgEnum("stage_type_enum", [
  "contest",
  "mcq_test",
  "resume_filter",
  "interview",
]);

export const stageSelectionCriteria = pgEnum("stage_flow_criteria", [
  "automatic",
  "manual",
]);

export const stageSelectType = pgEnum("stage_select_type", ["strict", "relax"]);

export const stageStatusEnum = pgEnum("stage_status_enum", [
  "upcomming",
  "ongoing",
  "completed",
]);
