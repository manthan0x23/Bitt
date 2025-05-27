import { relations } from "drizzle-orm";
import { organizations } from "./organizations";
import { admins } from "./admins";

export const organizationAdminRelations = relations(admins, ({ many }) => ({
  admins: many(admins),
}));

export const adminOrganizationRelations = relations(
  organizations,
  ({ one }) => ({
    organization: one(organizations),
  })
);
