import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { memberColumns } from './columns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { GetOrganizationMembersCallResponseT } from '../../server-calls/get-organization-members';

// Debounce hook
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

type MembersDataTableProps = {
  members: GetOrganizationMembersCallResponseT['data'];
};

export const MembersDataTable = ({ members }: MembersDataTableProps) => {
  const [searchInput, setSearchInput] = React.useState('');
  const debouncedInput = useDebounce(searchInput, 250);

  // Safely extract roleDetails
  const data = React.useMemo(() => {
    return members.map((m) =>
      'role' in m && typeof m.role === 'object'
        ? { ...m, roleDetails: m.role }
        : m,
    );
  }, [members]);

  const table = useReactTable({
    data,
    columns: memberColumns,
    state: {
      globalFilter: debouncedInput,
    },
    onGlobalFilterChange: setSearchInput,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      const name = row.original.name?.toLowerCase() || '';
      const username = row.original.username.toLowerCase();
      const email = row.original.workEmail.toLowerCase();
      return (
        name.includes(search) ||
        username.includes(search) ||
        email.includes(search)
      );
    },
  });

  return (
    <div className="space-y-4">
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search by name, username, or email..."
        className="w-full max-w-sm"
      />
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="text-center"
                >
                  No matching members.
                </TableCell>
              </TableRow>
            ) : (
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
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
