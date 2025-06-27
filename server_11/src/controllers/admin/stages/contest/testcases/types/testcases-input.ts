import { z } from "zod";

const testcasesTypeEnum = z.enum(["example", "system", "hidden"]);

const multerFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  buffer: z.instanceof(Buffer),
  size: z.number(),
});

const isTxtFile = (file: z.infer<typeof multerFileSchema>) => {
  const name = file.originalname || "";
  const mimetype = file.mimetype || "";
  return (
    name.toLowerCase().endsWith(".txt") &&
    (mimetype === "text/plain" || mimetype === "")
  );
};

export const zCreateTestcaseInput = z
  .object({
    inputFile: z.array(multerFileSchema).optional(),
    outputFile: z.array(multerFileSchema).optional(),
    inputText: z.string().optional(),
    outputText: z.string().optional(),
    points: z.coerce.number().min(0).default(0),
    type: testcasesTypeEnum.default("system"),
    contestProblemId: z.string().min(1),
  })
  .refine((data) => !!data.inputFile !== !!data.inputText, {
    message: "Provide either inputFile or inputText (not both or none)",
    path: ["input"],
  })
  .refine((data) => !data.inputFile || data.inputFile.length === 1, {
    message: "Only one input file is allowed",
    path: ["inputFile"],
  })
  .refine(
    (data) =>
      !data.inputFile ||
      (data.inputFile.length === 1 && isTxtFile(data.inputFile[0])),
    {
      message: "Input file must be a .txt file",
      path: ["inputFile"],
    }
  )
  .refine((data) => !!data.outputFile !== !!data.outputText, {
    message: "Provide either outputFile or outputText (not both or none)",
    path: ["output"],
  })
  .refine((data) => !data.outputFile || data.outputFile.length === 1, {
    message: "Only one output file is allowed",
    path: ["outputFile"],
  })
  .refine(
    (data) =>
      !data.outputFile ||
      (data.outputFile.length === 1 && isTxtFile(data.outputFile[0])),
    {
      message: "Output file must be a .txt file",
      path: ["outputFile"],
    }
  );
