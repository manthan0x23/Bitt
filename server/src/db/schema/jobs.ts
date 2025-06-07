import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  pgEnum,
  index,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { shortId } from "../../utils/integrations/short-id";
import { jobStatusEnum, jobTypeEnum, screeningTypeEnum } from "./enums";

export const jobs = pgTable(
  "jobs",
  {
    id: varchar("id", { length: 256 })
      .primaryKey()
      .notNull()
      .$defaultFn(shortId),

    title: varchar("title", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),

    description: text("description").notNull(),
    location: varchar("location", { length: 128 }).notNull(),

    type: jobTypeEnum("type").notNull(),
    status: jobStatusEnum("status").default("draft").notNull(),
    screeningType: screeningTypeEnum("screening_type")
      .default("multi-stage")
      .notNull(),

    endDate: timestamp("end_date").notNull(),

    tags: jsonb("tags").$type<string[]>().default([]),

    resumeRequired: boolean("resume_required").default(false).notNull(),
    coverLetterRequired: boolean("cover_letter_required")
      .default(false)
      .notNull(),

    isCreationComplete: boolean("is_creation_complete")
      .default(false)
      .notNull(),

    experience: integer("experience").default(0).notNull(),
    openings: integer("openings").default(1).notNull(),

    organizationId: varchar("organization_id", { length: 256 })
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orgIdIndex: index("jobs_org_id_idx").on(table.organizationId),
    slugIndex: index("jobs_slug_idx").on(table.slug),
    statusIndex: index("jobs_status_idx").on(table.status),
    typeIndex: index("jobs_type_idx").on(table.type),
    screeningTypeIndex: index("jobs_screening_type_idx").on(
      table.screeningType
    ),
    createdAtIndex: index("jobs_created_at_idx").on(table.createdAt),

    resumeRequiredIndex: index("jobs_resume_required_idx").on(
      table.resumeRequired
    ),
  })
);
