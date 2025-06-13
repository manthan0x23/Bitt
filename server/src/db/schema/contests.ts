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
  time,
  json,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { contestTypeEnum, contestAccessEnum, contestStateEnum } from "./enums";
import { stages } from "./stages";

export const contests = pgTable(
  "contests",
  {
    id: varchar("contests", { length: 256 })
      .notNull()
      .primaryKey()
      .$defaultFn(shortId),

    title: varchar("title", { length: 256 }),
    description: text("descriptions"),
    instructions: text("instructions"),

    stageId: varchar("stage_id", { length: 256 }).references(() => stages.id, {
      onDelete: "cascade",
    }),

    isIndependent: boolean("is_independent").default(false),

    startAt: timestamp("start_at").notNull(),
    endAt: timestamp("end_at"),

    duration: bigint("duration", { mode: "number" }).default(0),

    contestType: contestTypeEnum("contest_type").default("live").notNull(),
    accessibility: contestAccessEnum("accessibility")
      .default("public")
      .notNull(),

    requiresVideoMonitoring: boolean("requires_video_monitoring").default(
      false
    ),
    requiresAudioMonitoring: boolean("required_audio_monitoring").default(
      false
    ),
    requiresAIMonitoring: boolean("requires_ai_monitoring").default(false),
    requiresScreenMonitoring: boolean("requires_screen_monitoring").default(
      false
    ),
    availableForPractise: boolean("available_for_practise").default(false),

    state: contestStateEnum("publish_state").notNull(),
    noOfProblems: integer("no_of_problems").default(1).notNull(),
    warnings: json("warnings").$type<string[]>().default([]),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    startAtIndex: index("contests_start_at_idx").on(table.startAt),
    endAtIndex: index("contests_end_at_idx").on(table.endAt),
    publishStateIndex: index("contests_publish_state_idx").on(table.state),
    createdAtIndex: index("contests_created_at_idx").on(table.createdAt),
  })
);
