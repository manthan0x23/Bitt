import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { submissions } from "../../../db/schema/submissions";
import { shortId } from "../../../utils/integrations/short-id";
import {
  BadRequestError,
  UnauthorizedError,
  InternalServerError,
} from "../../../utils/errors";
import { zCreateSubmissionInput } from "./types/create-submission-input";
import { StorageService } from "../../../services/aws/storage";
import { SubmissionQueueService } from "../../../services/aws/queue";

export const createSubmission = async (req: Request, res: Response): Promise<any> => {
  if (!req.user || req.user.type !== "user") {
    throw new UnauthorizedError("Only authenticated users can submit code");
  }

  const parseResult = zCreateSubmissionInput.safeParse(req.body);
  if (!parseResult.success) {
    throw new BadRequestError(parseResult.error.message);
  }

  const { problemId, contestId, code, language, contestRegisterationId } =
    parseResult.data;

  try {
    const storageService = new StorageService();

    const submissionId = shortId();
    const codeKey = `bit/submissions/user-${req.user.id}/submission-${submissionId}/code`;

    await storageService.uploadObject(codeKey, code, "text/plain");

    const submissionQueueService = new SubmissionQueueService();

    if (await submissionQueueService.sendSubmission(submissionId)) {
      await db
        .insert(submissions)
        .values({
          id: submissionId,
          contestRegisterationId,
          problemId,
          contestId,
          language,
          codeKey,
          submissionStatus: "QU",
          submittedAt: new Date(),
          createdByIp: req.ip,
        })
        .returning();

      return res.status(201).json({
        message: "Submission queued successfully",
      });
    }
  } catch (error) {
    console.error("[submitCode]", error);
    throw new InternalServerError("Failed to store submission");
  }
};
