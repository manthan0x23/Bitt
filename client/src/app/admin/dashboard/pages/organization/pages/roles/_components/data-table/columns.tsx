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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/drop-down';

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
    accessorKey: 'dropdown',
    header: '',
    cell: () => {
      return (
        <div className="w-full text-right pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-accent cursor-pointer text-center align-middle pb-2 focus:outline-none">
              ...
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
