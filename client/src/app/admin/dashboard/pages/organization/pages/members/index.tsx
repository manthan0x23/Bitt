import { useQuery } from '@tanstack/react-query';
import {
  GetOrganizationMembersCall,
  type GetOrganizationMembersCallResponseT,
} from './server-calls/get-organization-members';
import type { ApiError } from '@/lib/error';

export const OrganizationMembers = () => {
  const membersQuery = useQuery<GetOrganizationMembersCallResponseT, ApiError>({
    queryKey: ['admin', 'organization', 'members'],
    queryFn: async () => (await GetOrganizationMembersCall()).data,
  });

  return <div>Org members</div>;
};
