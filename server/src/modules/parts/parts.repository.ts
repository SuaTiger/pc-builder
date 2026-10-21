import type { PartCategory, PartSpecByCategory } from '@pc-builder/shared';

/**
 * Everything the API needs from the database, described as an interface.
 * Routes and services depend on this interface, not on Drizzle, so tests can pass in
 * a fake that keeps data in memory. The real implementation is drizzle-parts.repository.ts.
 */
export interface PartsRepository {
  listByCategory<C extends PartCategory>(category: C): Promise<PartSpecByCategory[C][]>;

  /** Returns the parts that exist. Ids that match nothing are simply absent from the result. */
  findByIds<C extends PartCategory>(category: C, ids: string[]): Promise<PartSpecByCategory[C][]>;
}
