import { pgEnum } from "drizzle-orm/pg-core";

export const problemState = pgEnum("problem_state", ["draft", "live"]);
