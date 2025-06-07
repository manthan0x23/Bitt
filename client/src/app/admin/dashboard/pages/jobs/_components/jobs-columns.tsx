import type { ColumnDef } from '@tanstack/react-table';
import type { JobSchemaT } from '@/lib/types/jobs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const jobsColumns: ColumnDef<JobSchemaT>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.type;
      return <Badge variant="outline">{type}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;

      const statusStyleMap: Record<string, string> = {
        draft:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900',
        open: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
        closed:
          'bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900',
        expired: 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900',
      };

      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusStyleMap[status] || ''}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'screeningType',
    header: 'Screening',
    cell: ({ row }) => {
      return <span>{row.original.screeningType}</span>;
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => {
      return (
        <span>{format(new Date(row.original.endDate), 'dd MMM yyyy')}</span>
      );
    },
  },
  {
    accessorKey: 'resumeRequired',
    header: 'Resume',
    cell: ({ row }) => {
      return row.original.resumeRequired ? 'Required' : 'Optional';
    },
  },
  {
    accessorKey: 'coverLetterRequired',
    header: 'Cover Letter',
    cell: ({ row }) => {
      return row.original.coverLetterRequired ? 'Required' : 'Optional';
    },
  },
];
