import {
  bigint,
  boolean,
  index,
  pgTable,
  text,
  time,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { stages } from ".";
import { quizStateEnum, quizStatusEnum, quizTypeEnum } from "./enums";

export const quizes = pgTable(
  "quizes",
  {
    id: varchar("id", { length: 256 }).notNull().unique().$defaultFn(shortId),

    title: varchar("title"),

    description: text("description"),

    stageId: varchar("stage_id")
      .notNull()
      .references(() => stages.id, { onDelete: "no action" })
      .unique(),

    startAt: timestamp("started_at").notNull().defaultNow(),
    duration: bigint("duration", { mode: "number" }).default(0),
    endAt: timestamp("end_at").notNull().defaultNow(),

    quizType: quizTypeEnum("type").default("live"),
    state: quizStatusEnum("status").default("draft"),
    accessibility: quizStateEnum("state").default("public"),

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
