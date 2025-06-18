import z from "zod/v4";

export const capabilitiesMap = {
  organization: {
    update: "update.organizationDetails",
  },
  job: {
    create: "create.job",
    update: "update.job",
    delete: "delete.job",
  },
  stage: {
    create: "create.stage",
    update: "update.stage",
    delete: "delete.stage",
  },
  contest: {
    update: "update.contest",
  },
  contestProblem: {
    create: "create.contest_problem",
    update: "update.contest_problem",
    delete: "delete.contest_problem",
  },
  billing: {
    update: "update.billing",
  },
  analytics: {
    view: "view.analytics",
  },
  invite: {
    create: "create.invite",
    read: "read.invite",
    update: "update.invite",
    delete: "delete.invite",
  },
  task: {
    assign: "assign.task",
    view: "view.task",
    update: "update.task",
  },
  interview: {
    schedule: "schedule.interview",
    take: "take.interview",
  },
  quiz: {
    update: "update.quiz",
    generate: "generate.quiz",
    read: "read.quiz",
  },
  quizProblem: {
    create: "create.quiz_problem",
    update: "update.quiz_problem",
    read: "read.quiz_problem",
  },
  candidate: {
    passStage: "pass.candidate.stage",
    viewSubmissions: "view.candidate.submissions",
  },
} as const;

export const capabilities = Object.values(capabilitiesMap).flatMap((group) =>
  Object.values(group)
);
export type Capability = (typeof capabilities)[number];

export const zCapabilityEnum = z.enum(
  capabilities as [Capability, ...Capability[]]
);
