import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { roleColumns } from './columns';
import type { RoleSchemaT } from '@/lib/types/roles';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import type { Capability } from '@/lib/types/capabilities';

type RolesDataTableProps = {
  data: RoleSchemaT[];
};

export const RolesDataTable = ({ data }: RolesDataTableProps) => {
  const [capabilityFilter, setCapabilityFilter] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    if (capabilityFilter.length === 0) return data;
    return data.filter((role) =>
      capabilityFilter.every((cap) =>
        role.capabilities.includes(cap as Capability),
      ),
    );
  }, [data, capabilityFilter]);

  const table = useReactTable({
    data: filteredData,
    columns: roleColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  const allCapabilities = useMemo(() => {
    const caps = new Set<string>();
    data.forEach((role) => role.capabilities.forEach((cap) => caps.add(cap)));
    return Array.from(caps);
  }, [data]);

  return (
    <div className="space-y-2 h-full w-full">
      {/* Filter Controls */}
      <div className=" h-[10%]">
        <MultiSelect
          options={allCapabilities.map((c) => ({ label: c, value: c }))}
          value={capabilityFilter}
          onValueChange={setCapabilityFilter}
          placeholder="Filter by capabilities"
          className='w-1/3'
        />
      </div>

      <div className="h-[87%] flex flex-col items-center justify-between gap-4">
        <div className="w-full rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-sm font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={roleColumns.length}
                    className="text-center"
                  >
                    No roles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
