import { colorSchemeEnum } from '@/integrations/theme/colors/scheme';
import { z } from 'zod/v4';
import { zCapabilityEnum } from '../../capabilities';

export const zRoleSchema = z.object({
  id: z.string().min(1),
  tag: z.string().min(1).max(64),
  capabilities: z.array(zCapabilityEnum),
  organizationId: z.string().min(1),
  colorScheme: colorSchemeEnum,
  isTemplate: z.boolean(),
});

export const colorSchemeBgClassMap: Record<string, string> = {
  gray: 'bg-gray-500 dark:bg-accent-foreground',
  blue: 'bg-blue-500 dark:bg-accent-foreground',
  green: 'bg-green-500 dark:bg-accent-foreground',
  red: 'bg-red-500 dark:bg-accent-foreground',
  pink: 'bg-pink-500 dark:bg-accent-foreground',
  orange: 'bg-orange-500 dark:bg-accent-foreground',
  yellow: 'bg-yellow-500 dark:bg-accent-foreground',
  purple: 'bg-purple-500 dark:bg-accent-foreground',
  teal: 'bg-teal-500 dark:bg-accent-foreground',
  indigo: 'bg-indigo-500 dark:bg-accent-foreground',
};
