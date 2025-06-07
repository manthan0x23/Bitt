import { pgTable, timestamp, varchar, text } from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { stages } from "./stages";

export const interviews = pgTable("interviews", {
  id: varchar("id", { length: 256 }).notNull().unique().$defaultFn(shortId),

  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),

  stageId: varchar("stage_id")
    .references(() => stages.id)
    .notNull()
    .unique(),

  startAt: timestamp("start_at"),
  endAt: timestamp("end_at"),

  createdAt: timestamp("created_at").defaultNow(),
  upatedAt: timestamp("updated_at").defaultNow(),
});
