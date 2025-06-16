import { z } from 'zod/v4';

const fileOrTextField = z
  .object({
    file: z.instanceof(File).nullable(),
    text: z.string().nullable(),
  })
  .refine(
    (data) => {
      const hasFile = !!data.file;
      const hasText = !!data.text && data.text.trim() !== '';
      return hasFile !== hasText;
    },
    {
      message: 'Provide either a file or text (not both or none)',
      path: ['file'],
    },
  );

export const zTestcaseFormSchema = z.object({
  contestProblemId: z.string().min(1, 'Required'),
  type: z.enum(['example', 'system', 'hidden']),
  points: z.number().nonnegative().min(0, 'Points must be given minimum 0'),

  input: fileOrTextField,
  output: fileOrTextField,
});
