import type { z } from 'zod/v4';
import type { zOrganizationSchema } from './validator';

export type OrganizationSchemaT = z.infer<typeof zOrganizationSchema>;
