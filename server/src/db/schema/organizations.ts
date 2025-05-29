import {
  date,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
  name: varchar("name").notNull(),
  slug: text("slug").notNull(),

  description: text("description"),
  logoUrl: text("logo_url"),
  billingEmailAddress: text("billing_email_address"),

  origin: text("origin"),
  startDate: date("start_date"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  createdBy: uuid("created_by").notNull(),
});
