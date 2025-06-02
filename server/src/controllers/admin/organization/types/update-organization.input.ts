import { z } from "zod";
import { zCreateOrganizationInput } from "./create-organization.input";

export const zUpdateOrganizationInput = zCreateOrganizationInput.partial();
