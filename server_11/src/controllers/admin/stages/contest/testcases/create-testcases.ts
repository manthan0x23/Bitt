import type { Request, Response } from "express";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../../../utils/errors";
import {
  admins,
  contestProblems,
  contests,
  testcases,
} from "../../../../../db/schema";
import { db } from "../../../../../db/db";
import { eq } from "drizzle-orm";
import { zCreateTestcaseInput } from "./types/testcases-input";
import { StorageService } from "../../../../../services/aws/storage";
import fromBuffer from "magic-bytes.js";
import { shortId } from "../../../../../utils/integrations/short-id";

export const createTestCase = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zCreateTestcaseInput.safeParse({
    ...req.body,
    ...req.files,
  });

  if (parsed.error) {
    throw new BadRequestError(parsed.error.message);
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized to create testcase");
  }

  try {
    const [admin] = await db
      .select({
        id: admins.id,
        organizationId: admins.organizationId,
      })
      .from(admins)
      .where(eq(admins.id, req.user.id))
      .limit(1);

    console.log(req.user);
    if (!admin || !admin.organizationId)
      throw new BadRequestError("Admin does not belong to any organization");

    const [data] = await db
      .select()
      .from(contestProblems)
      .where(eq(contestProblems.id, parsed.data.contestProblemId))
      .innerJoin(contests, eq(contests.id, contestProblems.contestId))
      .limit(1);

    if (!data) {
      throw new BadRequestError("Contest problem not found");
    }

    const contest = data.contests;

    if (!contest || contest.organizationId !== admin.organizationId) {
      throw new UnauthorizedError(
        "Not authorized to create testcase for this problem"
      );
    }

    const storageService = new StorageService();

    const {
      inputFile,
      inputText,
      outputFile,
      outputText,
      points,
      type,
      contestProblemId,
    } = parsed.data;

    const uploadTextAsFile = async (
      text: string,
      prefix: string
    ): Promise<string> => {
      const key = `bit/contest/${
        contest.id
      }/${contestProblemId}/${prefix}/${shortId(10)}.txt`;
      await storageService.uploadObject(key, text, "text/plain");
      return key;
    };

    const uploadFileToS3 = async (
      file: any,
      prefix: string
    ): Promise<string> => {
      if (!file) throw new BadRequestError("File is undefined");

      const typeInfo = fromBuffer(file.buffer);

      if (typeInfo.length > 0) {
        throw new BadRequestError("Only plain text files are allowed");
      }

      const key = `bit/contest/${
        contest.id
      }/${contestProblemId}/${prefix}/${shortId(10)}.txt`;
      await storageService.uploadObject(key, file.buffer, "text/plain");
      return key;
    };

    let inputKey: string;
    let outputKey: string;

    if (inputFile) {
      inputKey = await uploadFileToS3(inputFile[0]!, "input");
    } else if (inputText) {
      inputKey = await uploadTextAsFile(inputText, "input");
    } else {
      throw new BadRequestError("Missing input");
    }

    if (outputFile) {
      outputKey = await uploadFileToS3(outputFile[0]!, "output");
    } else if (outputText) {
      outputKey = await uploadTextAsFile(outputText, "output");
    } else {
      throw new BadRequestError("Missing output");
    }

    await db.insert(testcases).values({
      contestProblemId,
      input: inputKey,
      output: outputKey,
      points,
      type,
    });

    res.status(201).json({ message: "Testcase created successfully." });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during testcase creation.");
  }
};
