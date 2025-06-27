import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { jobs } from "./jobs";
import { users } from "./users";
import { stagePromotionTypeEnum } from "./enums";

export const jobRegistrations = pgTable(
  "job_registrations",
  {
    id: varchar("id", { length: 256 })
      .primaryKey()
      .notNull()
      .$defaultFn(shortId),

    jobId: varchar("job_id", { length: 256 })
      .notNull()
      .references(() => jobs.id, { onDelete: "restrict" }),

    userId: varchar("user_id", { length: 256 })
      .notNull()
      .references(() => users.id),

    promotionType: stagePromotionTypeEnum().notNull().default("automatic"),

    coverLetter: text("cover_letter").notNull(),

    stageIndex: integer("stage_index").notNull().default(1),

    registeredAt: timestamp("registered_at").defaultNow().notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    jobUserStageCompositeKey: uniqueIndex(
      "job_user_stage_composite_key_idx"
    ).on(table.jobId, table.userId),
    jobStageIndex: index("job_stage_registered_idx").on(
      table.jobId,
      table.stageIndex
    ),
  })
);
