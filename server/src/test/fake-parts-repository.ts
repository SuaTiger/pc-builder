import type { PartCategory, PartSpecByCategory } from '@pc-builder/shared';
import type { PartsRepository } from '../modules/parts/parts.repository';

export type FakeData = { [C in PartCategory]?: PartSpecByCategory[C][] };

/** A PartsRepository that keeps everything in memory, so tests need no database. */
export function createFakePartsRepository(data: FakeData = {}): PartsRepository {
  const rowsFor = <C extends PartCategory>(category: C) =>
    (data[category] ?? []) as unknown as PartSpecByCategory[C][];

  return {
    async listByCategory(category) {
      return rowsFor(category);
    },
    async findByIds(category, ids) {
      return rowsFor(category).filter((part) => ids.includes(part.id));
    },
  };
}
