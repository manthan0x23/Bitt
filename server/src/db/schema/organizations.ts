import {
  date,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";

export const organizations = pgTable("organizations", {
  id: varchar("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => shortId(8)),
  name: varchar("name").notNull(),
  slug: text("slug").notNull(),

  description: text("description"),
  logoUrl: text("logo_url"),
  billingEmailAddress: text("billing_email_address"),

  origin: text("origin"),
  startDate: date("start_date"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  createdBy: varchar("created_by", { length: 256 }).notNull(),
});
