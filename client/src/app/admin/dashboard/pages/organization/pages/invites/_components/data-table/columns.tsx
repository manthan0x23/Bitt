// components/columns.tsx
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { OrganizationInviteSchema } from '@/lib/types/organization-invite';
import type { ColumnDef } from '@tanstack/react-table';

export const inviteColumns: ColumnDef<OrganizationInviteSchema>[] = [
  {
    accessorKey: 'code',
    header: 'Invite Code',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.code}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
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
