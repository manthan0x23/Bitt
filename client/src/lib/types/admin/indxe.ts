import type { z } from 'zod/v4';
import type { zAdminSchema } from './validator';

export type AdminSchemaT = z.infer<typeof zAdminSchema>;
