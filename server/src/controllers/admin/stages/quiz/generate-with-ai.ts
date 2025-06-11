import type { Request, Response } from "express";
import { db } from "../../../../db/db";
import {
  quizes,
  admins,
  stages,
  quizProblems,
  jobs,
  prompts,
} from "../../../../db/schema";
import { eq, InferInsertModel } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../utils/errors";
import { createDeepInfra } from "@ai-sdk/deepinfra";
import { generateText } from "ai";
import { Env } from "../../../../utils/env";
import z from "zod/v4";

const zQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  hint: z.string(),
  answer: z.union([z.number(), z.array(z.number())]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  explaination: z.string(),
  type: z.enum(["multiple_choice", "multiple_select", "text"]),
});

type InsertQuizProblem = InferInsertModel<typeof quizProblems>;

export const generateQuizWithAi = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { stageId } = req.params;

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized to create stage");
  }

  try {
    const [admin] = await db
      .select({ organizationId: admins.organizationId })
      .from(admins)
      .where(eq(admins.id, req.user.id));

    if (!admin.organizationId) {
      throw new BadRequestError("Admin doesn't belong to any organization");
    }

    const [stage] = await db
      .select()
      .from(stages)
      .where(eq(stages.id, stageId));

    if (!stage || stage.type !== "quiz" || !stage.secondTableId) {
      throw new NotFoundError("Quiz stage not found!");
    }

    const [job] = await db.select().from(jobs).where(eq(jobs.id, stage.jobId));

    const [quiz] = await db
      .select()
      .from(quizes)
      .where(eq(quizes.id, stage.secondTableId));

    if (!quiz?.id) {
      throw new NotFoundError("Quiz not found!");
    }

    const existingQuestions = await db
      .select()
      .from(quizProblems)
      .where(eq(quizProblems.quizId, quiz.id));

    const existingCount = existingQuestions.length;
    if (quiz.noOfQuestions === existingCount) {
      return res.status(200).json({
        message:
          "Either increase the number of questions or delete some to generate more.",
      });
    }

    const requiredQuestions = quiz.noOfQuestions - existingCount;

    const previousQuestionsSet = new Set(
      existingQuestions.map((q) => q.question.trim().toLowerCase())
    );

    const prompt = `
You are an expert technical quiz problem generator.

Your task is to create **${requiredQuestions}** high-quality multiple-choice questions for a quiz titled **"${
      quiz.title
    }"**, targeted at professionals with **${
      job.experience
    } years** of experience.

### ⚠️ STRICT REQUIREMENTS:
1. You must generate **diverse and uncommon questions**.
2. Questions must **justify the topic tags** they are assigned to.
3. Include a **mix of formats**:
   - Multiple-choice with a single correct answer
   - Multi-select (multiple correct options)
   - Integer answer (user inputs a number)
4. Each question must be:
   - Real-world or situation-based
   - Based on relevant **technologies and stacks** used in professional environments
5. Stick **strictly** to the following TypeScript schema:

type Question = {
  question: string;
  options: string[]; // 4 options
  hint: string;
  answer: number | number[]; // index or indices of correct options
  explaination: string;
  difficulty: "easy" | "medium" | "hard";
  type: "multiple_choice" | "multiple_select" | "text";
};

### 📌 Format Rules:
- Each question must have **4 options**, regardless of type.
- All options should be realistic and non-redundant.
- The 'difficulty' should match the depth/complexity of the question.

### 📚 Topic Tags:
Relevant tags: ${
      Array.isArray(quiz.tags)
        ? quiz.tags.join(", ")
        : typeof quiz.tags === "string"
        ? quiz.tags
        : "General"
    }

🚫 DO NOT:
- Include any markdown formatting or block wrappers
- Add commentary or formatting — just valid JSON

Respond with a JavaScript array of question objects, strictly adhering to the schema.
`;

    const deepinfra = createDeepInfra({ apiKey: Env.DEEP_INFRA_API_KEY });

    const {
      text: result,
      usage,
      finishReason,
    } = await generateText({
      model: deepinfra("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
      prompt,
    });

    await db.insert(prompts).values({
      prompt,
      result,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
      finishReason,
    });

    let parsed;
    try {
      parsed = z.array(zQuestion).parse(JSON.parse(result));
    } catch (err) {
      console.error("Zod parsing failed", err);
      throw new InternalServerError("AI response parsing failed.");
    }

    const filtered = parsed.filter(
      (q) => !previousQuestionsSet.has(q.question.trim().toLowerCase())
    );

    if (filtered.length === 0) {
      return res.status(200).json({
        message: "All generated questions already exist. Try regenerating.",
        data: [],
      });
    }

    const insertValues: InsertQuizProblem[] = filtered.map((q) => ({
      quizId: quiz.id,
      question: q.question,
      choices: q.options,
      answer: q.answer,
      explanation: q.explaination,
      type: q.type,
      points: 4,
      difficulty: q.difficulty,
    }));

    await db.insert(quizProblems).values(insertValues);

    return res.status(200).json({
      message: `Successfully generated ${insertValues.length} new question(s).`,
      data: insertValues.length,
    });
  } catch (error) {
    console.error("generateQuizWithAi error:", error);
    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during quiz generation.");
  }
};
