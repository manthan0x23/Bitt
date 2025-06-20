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
import MultiSelect from '@/components/ui/multi-select';
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
    <div className="space-y-4 w-full h-full overflow-y-scroll pr-4">
      {/* Filter + Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <MultiSelect
          options={allCapabilities.map((c) => ({
            label: c,
            value: c,
          }))}
          value={capabilityFilter.map((c) => ({
            label: c,
            value: c,
          }))}
          onChange={(newValues) =>
            setCapabilityFilter(newValues.map((opt) => opt.value))
          }
          placeholder="Filter by capabilities"
          badgeClassName="bg-background text-secondary-foreground dark:text-secondary border-secondary"
          className="min-w-[250px] max-w-full w-auto m-1"
        />
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border w-full overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-sm font-semibold">
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
                <TableCell colSpan={roleColumns.length} className="text-center">
                  No roles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
