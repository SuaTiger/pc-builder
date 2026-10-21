import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './http';

/**
 * Retry failures that might fix themselves (server waking up on the free plan, a dropped
 * connection) but never retry "no", "not found" or "not allowed": those will not change.
 */
function shouldRetry(failureCount: number, error: Error): boolean {
  const clientError = error instanceof ApiError && error.status >= 400 && error.status < 500;
  return !clientError && failureCount < 3;
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: shouldRetry, staleTime: 60_000, refetchOnWindowFocus: false },
    },
  });
}
