// components/columns.tsx
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type {
  OrganizationInviteSchema,
  OrganizationInviteStatus,
} from '@/lib/types/organization-invite';
import type { ColumnDef } from '@tanstack/react-table';
import {
  colorSchemeBgClassMap,
  type ColorSchemeEnum,
} from '@/integrations/theme/colors/scheme';
import { cn } from '@/lib/utils';

const inviteStatusToColor: Record<OrganizationInviteStatus, ColorSchemeEnum> = {
  active: 'green',
  closed: 'purple',
  expired: 'red',
  limit_reached: 'yellow',
  deleted: 'gray',
} as const;

export const inviteColumns: ColumnDef<OrganizationInviteSchema>[] = [
  {
    accessorKey: 'code',
    header: 'Invite Code',
    cell: ({ row }) => (
      <Badge
        className={cn('font-mono text-xs font-medium')}
        variant={'secondary'}
      >
        {row.original.code}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          'capitalize text-white dark:text-white',
          colorSchemeBgClassMap[inviteStatusToColor[row.original.status]],
        )}
      >
        {row.original.status.replace('_', ' ')}
      </Badge>
    ),
  },
  {
    accessorKey: 'inviteType',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.inviteType}
      </Badge>
    ),
  },
  {
    accessorKey: 'usageCount',
    header: 'Usage',
    cell: ({ row }) => (
      <span>
        {row.original.usageCount} / {row.original.usageLimit}
      </span>
    ),
  },
  {
    accessorKey: 'endDate',
    header: 'Expires On',
    cell: ({ row }) => (
      <span>{format(new Date(row.original.endDate), 'PPP')}</span>
    ),
  },
];
