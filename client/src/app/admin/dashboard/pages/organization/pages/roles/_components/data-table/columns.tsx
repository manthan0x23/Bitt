import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { colorSchemeBgClassMap } from '@/integrations/theme/colors/scheme';
import type { RoleSchemaT } from '@/lib/types/roles';
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { UpdateRoleForm } from '../update-role-form';
import { MdEdit } from 'react-icons/md';

export const roleColumns: ColumnDef<RoleSchemaT>[] = [
  {
    accessorKey: 'tag',
    header: 'Tag',
    cell: ({ row }) => (
      <Badge
        className={cn(
          colorSchemeBgClassMap[row.original.colorScheme],
          'text-white dark:text-white font-medium capitalize rounded-2xl px-2',
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
  {
    accessorKey: 'Edit',
    header: ' ',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <UpdateRoleForm
            open={open}
            onOpenChange={setOpen}
            role={row.original}
          />
          <p
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'cursor-pointer text-xs  flex justify-end pr-5 font-medium',
              !open && 'text-muted-foreground font-normal',
            )}
          >
            {open ? 'cancel' : 'edit'}
          </p>
        </>
      );
    },
  },
];
