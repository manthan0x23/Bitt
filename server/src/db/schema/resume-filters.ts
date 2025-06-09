import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { stages } from "./stages";
import { resumeFiltersEnum } from "./enums";
import { shortId } from "../../utils/integrations/short-id";

export const resumeFilters = pgTable("resume_filters", {
  id: varchar("id", { length: 256 }).notNull().unique().$defaultFn(shortId),
  stageId: varchar("stage_id")
    .references(() => stages.id)
    .notNull()
    .unique(),

  endAt: timestamp("end_at").defaultNow(),
  resumeFilterType: resumeFiltersEnum().default("hybrid"),

  createdAt: timestamp("created_at").defaultNow(),
  upatedAt: timestamp("updated_at").defaultNow(),
});
