import {
  capabilities,
  capabilitiesMap,
  Capability,
} from "./admin-capabilities";
import { AdminRole } from "./admin-roles";

export const roleCapabilitiesMap: Record<AdminRole, Capability[]> = {
  super_admin: capabilities,

  moderator: [
    capabilitiesMap.organization.update,

    capabilitiesMap.job.create,
    capabilitiesMap.job.update,
    capabilitiesMap.job.delete,

    capabilitiesMap.stage.create,
    capabilitiesMap.stage.update,
    capabilitiesMap.stage.delete,

    capabilitiesMap.billing.update,

    capabilitiesMap.task.assign,
    capabilitiesMap.task.view,
    capabilitiesMap.task.update,

    capabilitiesMap.invite.create,
    capabilitiesMap.invite.read,
    capabilitiesMap.invite.update,
    capabilitiesMap.invite.delete,

    capabilitiesMap.analytics.view,
  ],

  watcher: [
    capabilitiesMap.analytics.view,
    capabilitiesMap.candidate.viewSubmissions,
    capabilitiesMap.invite.read,
    capabilitiesMap.task.view,
  ],

  interviewer: [
    capabilitiesMap.interview.schedule,
    capabilitiesMap.interview.take,
    capabilitiesMap.candidate.passStage,
    capabilitiesMap.candidate.viewSubmissions,
  ],

  problem_setter: [
    capabilitiesMap.contest.update,
    capabilitiesMap.contestProblem.create,
    capabilitiesMap.contestProblem.update,
    capabilitiesMap.contestProblem.delete,

    capabilitiesMap.quiz.generate,
    capabilitiesMap.quiz.update,
    capabilitiesMap.quiz.read,

    capabilitiesMap.quizProblem.create,
    capabilitiesMap.quizProblem.read,
    capabilitiesMap.quizProblem.update,
  ],

  restrict: [],
};
