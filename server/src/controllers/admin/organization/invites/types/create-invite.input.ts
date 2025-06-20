import { z } from "zod/v4";
import { zOrganizationInviteTypeEnum } from "./update-invite.input";
import { zCapabilityEnum } from "../../../../../utils/types/admin-capabilities";
import { colorSchemeEnum } from "../../../../../utils/types/default-roles-org";

export const zCreateOrganizationInviteInput = z
  .object({
    allowedOrigins: z.array(z.email()),
    inviteType: zOrganizationInviteTypeEnum,
    roleId: z.string().nullable(),
    usageLimit: z.number().nonnegative().min(1),
    endDate: z
      .string()
      .nullable()
      .transform((d) => {
        if (d) return new Date(d);
        const date = new Date();
        date.setDate(date.getDate() + 1000);
        return date;
      }),
    roleType: z.enum(["custom", "template"]),
    roleTag: z.string().nullable(),
    roleCapabilities: z.array(zCapabilityEnum).nullable(),
    roleColorScheme: colorSchemeEnum.nullable(),
    roleIsTemplate: z.boolean().nullable(),
  })
  .check(({ value, issues }) => {
    // For template roleType, roleId must be present
    if (value.roleType === "template" && !value.roleId) {
      issues.push({
        code: "invalid_value",
        path: ["roleId"],
        message: "Select a predefined role template.",
        input: value.roleId,
        values: [],
      });
    }

    // For custom roleType, required custom fields must be present
    if (value.roleType === "custom") {
      if (!value.roleTag || value.roleTag.trim().length === 0) {
        issues.push({
          code: "invalid_value",
          path: ["roleTag"],
          message: "Provide a role tag name.",
          input: value.roleTag,
          values: [],
        });
      }

      if (!value.roleCapabilities || value.roleCapabilities.length === 0) {
        issues.push({
          code: "invalid_value",
          path: ["roleCapabilities"],
          message: "Select at least one capability.",
          input: value.roleCapabilities,
          values: [],
        });
      }

      if (!value.roleColorScheme) {
        issues.push({
          code: "invalid_value",
          path: ["roleColorScheme"],
          message: "Choose a color scheme.",
          input: value.roleColorScheme,
          values: [],
        });
      }

      if (value.roleIsTemplate === null || value.roleIsTemplate === undefined) {
        issues.push({
          code: "invalid_value",
          path: ["roleIsTemplate"],
          message: "Specify whether to save this role as a template.",
          input: value.roleIsTemplate,
          values: [],
        });
      }
    }

    // Invite type strict requires at least one allowed origin
    if (value.inviteType === "strict" && value.allowedOrigins.length === 0) {
      issues.push({
        code: "invalid_value",
        path: ["allowedOrigins"],
        message: "Add at least one allowed email for strict invites.",
        input: value.allowedOrigins,
        values: [],
      });
    }
  });

export type CreateOrganizationInviteSchemaT = z.infer<
  typeof zCreateOrganizationInviteInput
>;
