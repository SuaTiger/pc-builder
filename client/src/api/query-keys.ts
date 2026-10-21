import type { PartCategory } from '@pc-builder/shared';

/**
 * Every cache key in one place. Data fetched under a key can be refreshed or cleared
 * by naming that key, so keys must be written the same way everywhere.
 */
export const queryKeys = {
  parts: (category: PartCategory) => ['parts', category] as const,
  me: (userId: string) => ['me', userId] as const,
  savedBuilds: ['saved-builds'] as const,
  savedBuild: (id: string) => ['saved-builds', id] as const,
  adminUsers: ['admin', 'users'] as const,
};
