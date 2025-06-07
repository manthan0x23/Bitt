import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  unique,
  bigint,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { contestTypeEnum, contestAccessEnum, contestStateEnum } from "./enums";
import { jobs } from "./jobs";

export const contests = pgTable(
  "contests",
  {
    id: varchar("contests", { length: 256 })
      .notNull()
      .primaryKey()
      .$defaultFn(shortId),

    title: varchar("title", { length: 256 }),
    description: text("descriptions"),

    stageId: varchar("stage_id", { length: 256 })
      .references(() => jobs.id, { onDelete: "cascade" })
      .notNull()
      .unique(),

    startAt: timestamp("start_at").notNull(),
    endAt: timestamp("end_at").notNull(),

    duration: bigint("duration", { mode: "number" }).default(10).notNull(),

    contestType: contestTypeEnum("contest_type").default("live").notNull(),
    accessibility: contestAccessEnum("accessibility")
      .default("public")
      .notNull(),

    availableForPractise: boolean("available_for_practise")
      .notNull()
      .default(true),

    publishState: contestStateEnum("publish_state").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    startAtIndex: index("contests_start_at_idx").on(table.startAt),
    endAtIndex: index("contests_end_at_idx").on(table.endAt),
    publishStateIndex: index("contests_publish_state_idx").on(
      table.publishState
    ),
    createdAtIndex: index("contests_created_at_idx").on(table.createdAt),
  })
);
