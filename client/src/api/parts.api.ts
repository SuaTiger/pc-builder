import { useQuery } from '@tanstack/react-query';
import type { PartCategory, PartsResponse } from '@pc-builder/shared';
import { apiRequest } from './http';
import { queryKeys } from './query-keys';

/** All parts of one category. The catalogue changes rarely, so it is cached for a while. */
export function usePartsQuery<C extends PartCategory>(category: C) {
  return useQuery({
    queryKey: queryKeys.parts(category),
    queryFn: () => apiRequest<PartsResponse<C>>(`/api/parts/${category}`),
    staleTime: 10 * 60_000,
    select: (response) => response.parts,
  });
}
