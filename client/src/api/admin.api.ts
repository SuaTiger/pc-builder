import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SetRoleRequest, UserSummary, UsersResponse } from '@pc-builder/shared';
import { apiRequest } from './http';
import { queryKeys } from './query-keys';

export function useUsersQuery() {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: () => apiRequest<UsersResponse>('/api/admin/users'),
    select: (response) => response.users,
  });
}

export function useSetRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string } & SetRoleRequest) =>
      apiRequest<UserSummary>(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: { role } satisfies SetRoleRequest,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers }),
  });
}
