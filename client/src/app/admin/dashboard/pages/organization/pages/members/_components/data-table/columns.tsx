// columns.ts
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { colorSchemeBgClassMap } from '@/integrations/theme/colors/scheme';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { GetOrganizationMembersCallResponseT } from '../../server-calls/get-organization-members';
import { RxCross2 } from 'react-icons/rx';
import { IoCheckmarkOutline } from 'react-icons/io5';

type MemberRowT = GetOrganizationMembersCallResponseT['data'][number];

export const memberColumns: ColumnDef<MemberRowT>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.original.name || row.original.username;
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.username}</div>
    ),
  },
  {
    accessorKey: 'workEmail',
    header: 'Email',
  },
  {
    accessorKey: 'emailVerified',
    header: 'Verified',
    cell: ({ row }) =>
      row.original.emailVerified ? (
        <div className="flex items-center justify-center gap-1">
          <IoCheckmarkOutline size={10} />
        </div>
      ) : (
        <div className="text-red-600 flex items-center justify-center gap-1">
          <RxCross2 size={10} />
        </div>
      ),
  },
  {
    accessorKey: 'accountSource',
    header: 'Source',
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.accountSource}
      </Badge>
    ),
  },
  {
    accessorKey: 'roleDetails.tag',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role;
      if (!role) return <Skeleton className="h-4 w-20" />;
      return (
        <Badge
          variant="outline"
          className={cn(
            'capitalize',
            colorSchemeBgClassMap[role.colorScheme],
            'text-white',
          )}
        >
          {role.tag}
        </Badge>
      );
    },
  },
];
