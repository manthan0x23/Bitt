import {
  bigint,
  boolean,
  index,
  integer,
  json,
  pgTable,
  text,
  time,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { organizations, stages } from ".";
import { quizStateEnum, quizStatusEnum, quizTypeEnum } from "./enums";

export const quizes = pgTable(
  "quizes",
  {
    id: varchar("id", { length: 256 })
      .notNull()
      .unique()
      .$defaultFn(shortId)
      .primaryKey(),

    title: varchar("title"),

    description: text("description"),
    instructions: text("instructions"),

    stageId: varchar("stage_id")
      .notNull()
      .references(() => stages.id, { onDelete: "no action" })
      .unique(),

    noOfQuestions: integer("no_of_questions").default(10).notNull(),
    tags: json("tags").$type<string | string[]>().notNull().default([]),

    startAt: timestamp("started_at").notNull().defaultNow(),
    duration: bigint("duration", { mode: "number" }).default(0),
    endAt: timestamp("end_at").notNull().defaultNow(),

    organizationId: varchar("organization_id", { length: 256 })
      .references(() => organizations.id)
      .notNull(),
    quizType: quizTypeEnum("type").default("live"),
    state: quizStatusEnum("status").default("draft"),
    accessibility: quizStateEnum("state").default("public"),

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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    typeIndex: index("quiz_type_index").on(table.quizType),
    statusIndex: index("quiz_status_index").on(table.state),
    state: index("quiz_state_index").on(table.state),
  })
);
