import {
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

    title: varchar("title").notNull(),

    description: text("description").notNull(),

    stageId: varchar("stage_id")
      .notNull()
      .references(() => stages.id, { onDelete: "no action" })
      .unique(),

    startDate: timestamp("started_at").notNull(),
    duration: time("duration").notNull(),
    endDate: timestamp("end_at").notNull(),

    type: quizTypeEnum("type").default("live"),
    status: quizStatusEnum("status").default("draft"),
    state: quizStateEnum("state").default("public"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    typeIndex: index("quiz_type_index").on(table.type),
    statusIndex: index("quiz_status_index").on(table.status),
    state: index("quiz_state_index").on(table.state),
  })
);
