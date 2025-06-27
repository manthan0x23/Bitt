import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { jobs } from "./jobs";
import {
  stageSelectionCriteria,
  stageSelectType,
  stageTypeEnum,
} from "./enums";

export const stages = pgTable(
  "stages",
  {
    id: varchar("id", { length: 256 }).notNull().unique().$defaultFn(shortId),

    stageIndex: integer("stage_index").notNull().default(1),

    type: stageTypeEnum().default("contest").notNull(),

    inflow: integer("inflow").default(2000).notNull(),
    outflow: integer("outflow").default(100).notNull(),

    description: text("description").notNull(),

    selectionCriteria: stageSelectionCriteria().default("automatic").notNull(),

    selectType: stageSelectType().notNull().default("relax"),
    isFinal: boolean("is_final").default(false),

    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),

    jobId: varchar("job_id", { length: 256 })
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),

    secondTableId: varchar("second_table_id"),
  },
  (table) => ({
    stageJobIdIndex: uniqueIndex("stage_job_id_index").on(
      table.jobId,
      table.stageIndex
    ),
  })
);
