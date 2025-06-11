import {
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";

export const prompts = pgTable("prompts", {
  id: varchar("id", { length: 256 })
    .$defaultFn(shortId)
    .notNull()
    .unique()
    .primaryKey(),

  prompt: text("prompt"),
  result: text("result"),

  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  totalTokens: integer("total_tokens"),
  finishReason: text("finish_reason"),

  createdAt: timestamp("created_at").defaultNow(),
});
