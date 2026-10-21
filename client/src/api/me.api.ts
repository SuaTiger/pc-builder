import { useQuery } from '@tanstack/react-query';
import type { MeResponse, Permission } from '@pc-builder/shared';
import { useAuth } from '../features/auth/auth-context';
import { apiRequest } from './http';
import { queryKeys } from './query-keys';

/** Who is logged in and what they may do, as our API sees it (not just Supabase). */
export function useMe() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: queryKeys.me(userId ?? 'anonymous'),
    queryFn: () => apiRequest<MeResponse>('/api/me'),
    enabled: Boolean(userId),
    staleTime: 5 * 60_000,
  });
}

/** Use this to decide whether to show a button or link. The server still enforces the rule. */
export function useHasPermission(permission: Permission): boolean {
  const { data } = useMe();
  return data?.permissions.includes(permission) ?? false;
}
