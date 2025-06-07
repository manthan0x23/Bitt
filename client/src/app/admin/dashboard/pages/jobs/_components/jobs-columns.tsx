import type { ColumnDef } from '@tanstack/react-table';
import type { JobSchemaT } from '@/lib/types/jobs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { GoArrowRight } from 'react-icons/go';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useRouter } from '@tanstack/react-router';

export const getJobsColumns = (
  showTags: boolean,
  toggleShowTags: () => void,
): ColumnDef<JobSchemaT>[] => [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'type',
    cell: ({ row }) => {
      const type = row.original.type;
      return <Badge variant="outline">{type}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'status',
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
    accessorKey: 'openings',
    header: 'openings',
    cell: ({ row }) => {
      return <span>{row.original.openings}</span>;
    },
  },
  {
    accessorKey: 'endDate',
    header: 'end date',
    cell: ({ row }) => {
      return (
        <span>{format(new Date(row.original.endDate), 'dd MMM yyyy')}</span>
      );
    },
  },
  {
    accessorKey: 'screeningType',
    header: 'screening',
    cell: ({ row }) => {
      if (row.original.screeningType === 'application')
        return (
          <span className="text-pink-600 font-medium">
            {row.original.screeningType}
          </span>
        );
      return <span className="font-medium">{row.original.screeningType}</span>;
    },
  },
  {
    accessorKey: 'resumeRequired',
    header: 'resume',
    cell: ({ row }) => {
      return row.original.resumeRequired ? 'Yes' : 'No';
    },
  },
  {
    accessorKey: 'coverLetterRequired',
    header: 'cover letter',
    cell: ({ row }) => {
      return row.original.coverLetterRequired ? 'Yes' : 'No';
    },
  },
  {
    accessorKey: 'isCreationComplete',
    header: 'completed',
    cell: ({ row }) => {
      const isComplete = row.original.isCreationComplete;
      return (
        <div
          className={`h-2 w-2 rounded-full ${
            isComplete
              ? 'bg-green-400 dark:bg-green-400'
              : 'bg-red-600 dark:bg-red-400'
          }`}
        />
      );
    },
  },
  {
    accessorKey: 'tags',
    header: () => (
      <button
        onClick={toggleShowTags}
        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition"
      >
        Tags {showTags ? <IoEye size={16} /> : <IoEyeOff size={16} />}
      </button>
    ),
    cell: ({ row }) => {
      const tags = row.original.tags ?? [];
      return showTags ? (
        <div className="flex flex-wrap gap-1 max-w-[120px]">
          {tags.length > 0 ? (
            tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs break-words whitespace-normal"
              >
                {tag}
              </Badge>
            ))
          ) : (
            <Badge
              variant="outline"
              className="text-xs break-words whitespace-normal"
            >
              None
            </Badge>
          )}
        </div>
      ) : null;
    },
    size: 140,
  },
  {
    accessorKey: 'navigate',
    header: '',
    cell: ({ row }) => {
      const router = useRouter();

      return (
        <div className="h-full">
          <GoArrowRight
            onClick={() =>
              router.navigate({
                to: `/admin/jobs/${row.original.id}/edit`,
              })
            }
            className=" h-full cursor-pointer hover:text-primary transition hover:translate-x-1"
          />
        </div>
      );
    },
  },
];
