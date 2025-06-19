import { useQuery } from '@tanstack/react-query';
import {
  GetOrganizationInvitesCall,
  type GetOrganizationInvitesCallResponseT,
} from './server-calls/get-org-invites';
import type { ApiError } from '@/lib/error';
import { InvitesDataTable } from './_components/data-table/table';
import { inviteColumns } from './_components/data-table/columns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { CreateInviteForm } from './_components/create-invite-form';
import { RxCrossCircled } from 'react-icons/rx';

export const OrganizationInvites = () => {
  const [openCreate, setOpenCreate] = useState(false);

  const invitesQuery = useQuery<GetOrganizationInvitesCallResponseT, ApiError>({
    queryKey: ['admin', 'organization', 'invites', 'all'],
    queryFn: async () => (await GetOrganizationInvitesCall()).data,
  });

  return (
    <>
      <CreateInviteForm open={openCreate} onOpenChange={setOpenCreate} />
      <div className="h-full w-full flex flex-col gap-6">
        <div className="h-[10%] w-full flex justify-between items-center">
          <span className="space-y-1">
            <h4>Invites</h4>
            <p className="text-muted-foreground">
              View, create, and manage organization invites and their usage.
            </p>
          </span>
          <Button
            type="button"
            onClick={() => setOpenCreate((v) => !v)}
            variant={openCreate ? 'default' : 'outline'}
            className="cursor-pointer"
          >
            {!openCreate ? (
              <>
                <PlusCircle />
                Create Invite
              </>
            ) : (
              <>
                <RxCrossCircled />
                Cancel
              </>
            )}
          </Button>
        </div>
        <div className="h-[90%] w-full">
          {invitesQuery.data?.data && (
            <InvitesDataTable
              columns={inviteColumns}
              data={invitesQuery.data.data}
            />
          )}
        </div>
      </div>
    </>
  );
};
