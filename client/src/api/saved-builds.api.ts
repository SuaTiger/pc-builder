import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  SaveBuildRequest,
  SavedBuildDetail,
  SavedBuildsResponse,
} from '@pc-builder/shared';
import { apiRequest } from './http';
import { queryKeys } from './query-keys';

export function useSavedBuildsQuery() {
  return useQuery({
    queryKey: queryKeys.savedBuilds,
    queryFn: () => apiRequest<SavedBuildsResponse>('/api/me/builds'),
    select: (response) => response.builds,
  });
}

/** One saved build with parts and a fresh compatibility report. Does nothing without an id. */
export function useSavedBuildQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.savedBuild(id ?? 'none'),
    queryFn: () => apiRequest<SavedBuildDetail>(`/api/me/builds/${id}`),
    enabled: Boolean(id),
  });
}

/** Creates a build, or updates it when `id` is given. */
export function useSaveBuildMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id?: string; body: SaveBuildRequest }) =>
      id
        ? apiRequest<SavedBuildDetail>(`/api/me/builds/${id}`, { method: 'PUT', body })
        : apiRequest<SavedBuildDetail>('/api/me/builds', { method: 'POST', body }),
    onSuccess: (saved) => {
      // Show the saved version right away, and refresh the list on the "My builds" page.
      queryClient.setQueryData(queryKeys.savedBuild(saved.id), saved);
      void queryClient.invalidateQueries({ queryKey: queryKeys.savedBuilds, exact: true });
    },
  });
}

export function useDeleteBuildMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiRequest<void>(`/api/me/builds/${id}`, { method: 'DELETE' }),
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.savedBuild(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.savedBuilds, exact: true });
    },
  });
}
