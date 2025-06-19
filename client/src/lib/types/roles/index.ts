import type { z } from 'zod/v4';
import type { zRoleSchema } from './validators';

export type RoleSchemaT = z.infer<typeof zRoleSchema>;
