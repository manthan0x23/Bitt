import { pgEnum } from "drizzle-orm/pg-core";

// Capability enum from your capabilitiesMap
export const capabilityEnum = pgEnum("capability", [
  "update.organizationDetails",

  "create.job",
  "update.job",
  "delete.job",

  "create.stage",
  "update.stage",
  "delete.stage",

  "update.contest",
  "create.contest_problem",
  "update.contest_problem",
  "delete.contest_problem",

  "update.billing",
  "view.analytics",

  "create.invite",
  "read.invite",
  "update.invite",
  "delete.invite",

  "assign.task",
  "view.task",
  "update.task",
  "delete.task",

  "schedule.interview",
  "take.interview",

  "pass.candidate.stage",
  "view.candidate.submissions",

  "create.quiz_problem",
  "update.quiz_problem",
  "read.quiz_problem",

  "update.quiz",
  "generate.quiz",
  "read.quiz",
]);
