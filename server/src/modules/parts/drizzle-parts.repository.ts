import { asc, inArray } from 'drizzle-orm';
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import type { PartCategory, PartSpecByCategory } from '@pc-builder/shared';
import { db } from '../../db/client';
import { partTables } from '../../db/schema';
import type { PartsRepository } from './parts.repository';

/** The columns every part table shares (see schema/common.ts). */
type AnyPartTable = PgTable & { id: PgColumn; brand: PgColumn; name: PgColumn };

// Each table has different extra columns, so TypeScript sees the lookup as a union of eight
// table types. Every query below only touches the shared columns, so we treat the table as
// that common shape. The cast is the one place we tell TypeScript what we know and it cannot.
function tableFor(category: PartCategory): AnyPartTable {
  return partTables[category] as unknown as AnyPartTable;
}

export function createDrizzlePartsRepository(): PartsRepository {
  return {
    async listByCategory<C extends PartCategory>(category: C) {
      const table = tableFor(category);
      const rows = await db.select().from(table).orderBy(asc(table.brand), asc(table.name));
      return rows as unknown as PartSpecByCategory[C][];
    },

    async findByIds<C extends PartCategory>(category: C, ids: string[]) {
      if (ids.length === 0) return []; // `IN ()` is invalid SQL, so skip the query
      const table = tableFor(category);
      const rows = await db.select().from(table).where(inArray(table.id, ids));
      return rows as unknown as PartSpecByCategory[C][];
    },
  };
}
