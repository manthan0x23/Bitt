import type { Request, Response } from "express";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../utils/errors";
import { db } from "../../../../db/db";
import { admins, quizes, stages } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { zUpdateQuizInput } from "./types/create-quiz-input";

export const updateQuiz = async (req: Request, res: Response): Promise<any> => {
  const parsed = zUpdateQuizInput.safeParse(req.body);

  if (!parsed.success) {
    console.log(parsed.error);
    throw new BadRequestError(parsed.error.message);
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized to update stage");
  }

  try {
    const [admin] = await db
      .select({
        organizationId: admins.organizationId,
      })
      .from(admins)
      .where(eq(admins.id, req.user.id));

    if (!admin.organizationId) {
      throw new BadRequestError("Admins doest belong to any organizaiton");
    }

    const [stage] = await db
      .select()
      .from(stages)
      .where(eq(stages.id, parsed.data.stageId));

    if (!stage || stage.type != "quiz" || !stage.secondTableId) {
      throw new NotFoundError("Quiz stage not found !");
    }

    const [quiz] = await db
      .update(quizes)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(quizes.id, stage.secondTableId))
      .returning();

    return res.status(200).json({
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during stage creation.");
  }
};
