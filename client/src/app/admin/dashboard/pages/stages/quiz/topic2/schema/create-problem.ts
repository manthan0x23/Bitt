import { z } from 'zod/v4';
import {
  quizProblemDifficultyEnum,
  quizProblemTypeEnum,
} from '@/lib/types/quiz/validators';

export const zCreateProblemSchema = z
  .object({
    type: quizProblemTypeEnum, // 'multiple_choice' | 'multiple_select' | 'text'
    question: z.string().min(1, 'Question is required to proceed'),
    questionIndex: z.number().int().nonnegative().min(1),
    quizId: z.string().min(1),
    choices: z.array(z.string()),
    answer: z.union([z.number(), z.array(z.number())]).nullable(),
    textAnswer: z.string().nullable(),
    explanation: z.string(),
    points: z.number().int().nonnegative().min(1),
    difficulty: quizProblemDifficultyEnum,
  })
  .check(({ value, issues }) => {
    const { type, textAnswer, choices, answer } = value;

    // Text question: textAnswer required
    if (type === 'text') {
      if (!textAnswer || textAnswer.trim() === '' || textAnswer.length < 1) {
        issues.push({
          code: 'custom',
          path: ['textAnswer'],
          message: 'Text answer is required for text questions',
          input: value,
        });
      }
    }

    // Multiple Choice / Select: validate choices and answer
    if (type === 'multiple_choice' || type === 'multiple_select') {
      if (!choices || choices.length < 2) {
        issues.push({
          code: 'too_small',
          path: ['choices'],
          minimum: 2,
          type: 'array',
          inclusive: true,
          origin: 'array',
          message: 'At least two choices are required',
          input: value,
        });
      }

      if (choices.some((c) => c.trim() === '')) {
        issues.push({
          code: 'custom',
          path: ['choices'],
          message: 'Choices cannot be empty',
          input: value,
        });
      }

      if (type === 'multiple_choice') {
        if (typeof answer !== 'number') {
          issues.push({
            code: 'custom',
            path: ['answer'],
            message: 'A correct answer must be selected',
            input: value,
          });
        } else if (answer < 0 || answer >= choices.length) {
          issues.push({
            code: 'custom',
            path: ['answer'],
            message: 'Answer index is out of bounds',
            input: value,
          });
        }
      }

      if (type === 'multiple_select') {
        if (!Array.isArray(answer) || answer.length === 0) {
          issues.push({
            code: 'custom',
            path: ['answer'],
            message: 'At least one correct answer must be selected',
            input: value,
          });
        } else if (
          (answer as number[]).some((i) => i < 0 || i >= choices.length)
        ) {
          issues.push({
            code: 'custom',
            path: ['answer'],
            message: 'One or more answer indices are out of bounds',
            input: value,
          });
        }
      }
    }
  });

export const zUpdateProblemSchema = zCreateProblemSchema.extend({
  id: z.string().min(1, 'Quiz ID is required for updating'),
});
