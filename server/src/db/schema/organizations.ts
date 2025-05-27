import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations_table", {
  id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
  name: varchar("name").notNull(),
  slug: text("slug").notNull(),

  desciption: text("description"),
  logoUrl: text("logo_url"),
  billingEmailAddress: text("billing_email_address"),

  origin: text("origin"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  createdBy: uuid("created_by").notNull(),
});
