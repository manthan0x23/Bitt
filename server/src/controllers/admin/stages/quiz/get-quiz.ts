import type { Request, Response } from "express";
import { db } from "../../../../db/db";
import { quizes, admins, stages } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../utils/errors";

export const getQuiz = async (req: Request, res: Response): Promise<any> => {
  const { stageId } = req.params;

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized to create stage");
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
      .where(eq(stages.id, stageId));

    if (!stage || stage.type != "quiz" || !stage.secondTableId) {
      throw new NotFoundError("Quiz stage not found !");
    }

    const [quiz] = await db
      .select()
      .from(quizes)
      .where(eq(quizes.id, stage.secondTableId));

    return res.status(200).json({
      message: "Quiz data retrieved successfully",
      data: quiz,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during stage creation.");
  }
};
