import { ZodType } from "zod/v4";

export type FieldError = {
  key: string;
  error: string;
};

/**
 * Validate `obj` against `schema` and return an array of
 * { key, error } for each failed field.
 */
export function extractSchemaErrors<T>(
  obj: T,
  schema: ZodType<T, any, any>
): FieldError[] {
  const result = schema.safeParse(obj);
  if (result.success) {
    return [];
  }

  return result.error.issues
    .map((issue) => {
      const [path] = issue.path;
      if (typeof path === "string") {
        return { key: path, error: issue.message };
      }
    })
    .filter((x): x is FieldError => Boolean(x));
}
