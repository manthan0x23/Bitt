import { Badge } from '@/components/ui/badge';
import { colorSchemeBgClassMap } from '@/integrations/theme/colors/scheme';
import type { RoleSchemaT } from '@/lib/types/roles';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';

export const roleColumns: ColumnDef<RoleSchemaT>[] = [
  {
    accessorKey: 'tag',
    header: 'Tag',
    cell: ({ row }) => (
      <Badge
        className={cn(
          colorSchemeBgClassMap[row.original.colorScheme],
          'text-accent dark:text-accent-foreground capitalize',
        )}
      >
        {row.original.tag.split('_').join(' ')}
      </Badge>
    ),
  },
  {
    accessorKey: 'isTemplate',
    header: 'Template',
    cell: ({ row }) => (
      <span>
        {row.original.isTemplate ? <IoCheckmarkOutline /> : <RxCross2 />}
      </span>
    ),
  },
];
