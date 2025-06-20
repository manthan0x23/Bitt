import { useQuery } from '@tanstack/react-query';
import {
  GetOrganizationMembersCall,
  type GetOrganizationMembersCallResponseT,
} from './server-calls/get-organization-members';
import type { ApiError } from '@/lib/error';
import { Button } from '@/components/ui/button';
import { GoArrowRight } from 'react-icons/go';
import { useRouter } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { MembersDataTable } from './_components/data-table/table';

export const OrganizationMembers = () => {
  const router = useRouter();

  const membersQuery = useQuery<GetOrganizationMembersCallResponseT, ApiError>({
    queryKey: ['admin', 'organization', 'members'],
    queryFn: async () => (await GetOrganizationMembersCall()).data,
  });

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full flex justify-between items-center h-[10%]">
        <div>
          <h4>Members</h4>
          <p className="text-sm text-muted-foreground w-[70%] text-wrap">
            View and manage all members currently part of your organization. You
            can invite new members, monitor their roles, and control access
            levels.
          </p>
        </div>
        <Button
          onClick={() => {
            router.navigate({
              to: '/admin/organization/invites',
            });
          }}
          size={'sm'}
          className="cursor-pointer"
          variant={'outline'}
        >
          <GoArrowRight />
          Invite Members
        </Button>
      </div>
      <div className="h-[90%] w-full">
        {membersQuery.isLoading && (
          <Skeleton className="h-full w-full rounded-lg" />
        )}
        {membersQuery.isFetched && membersQuery.data?.data && (
          <MembersDataTable members={membersQuery.data.data} />
        )}
      </div>
    </div>
  );
};
