import { useQuery } from '@tanstack/react-query';
import {
  GetOrgRolesCall,
  type GetOrgRolesCallResponseT,
} from './server-calls/get-org-roles';
import type { ApiError } from '@/lib/error';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { RolesDataTable } from './_components/data-table/roles-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { CreateRoleForm } from './_components/create-role-form';

export const OrganizationRoles = () => {
  const [openCreate, setOpenCreate] = useState(false);

  const rolesQuery = useQuery<GetOrgRolesCallResponseT, ApiError>({
    queryKey: ['admin', 'organization', 'roles', 'all'],
    queryFn: async () => (await GetOrgRolesCall()).data,
  });

  return (
    <>
      <CreateRoleForm open={openCreate} onOpenChange={setOpenCreate} />
      <div className="w-full h-full flex flex-col gap-4 overflow-y-scroll overflow-x-hidden pr-5">
        <div className="h-[10%] w-full flex justify-between items-center">
          <div className="space-y-1">
            <h4>Roles</h4>
            <p className="text-muted-foreground text-sm">
              //TODO write a description
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setOpenCreate((v) => !v)}
            variant={openCreate ? 'default' : 'outline'}
            className="cursor-pointer"
          >
            {!openCreate ? (
              <>
                <PlusCircle />
                Create Role
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
          {rolesQuery.isLoading && (
            <Skeleton className="h-full w-full rounded-lg" />
          )}
          {rolesQuery.isFetched && rolesQuery.data?.data && (
            <RolesDataTable data={rolesQuery.data.data} />
          )}
        </div>
      </div>
    </>
  );
};
