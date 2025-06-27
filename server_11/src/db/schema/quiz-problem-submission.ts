import { pgTable, varchar } from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";

export const quizProblemSubmission = pgTable("quiz_problem_submission", {
  id: varchar("id", { length: 256 }).notNull().primaryKey().$defaultFn(shortId),

  
});
