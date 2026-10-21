import { integer, pgTable } from 'drizzle-orm/pg-core';
import { partColumns } from './common';
import { memoryTypeEnum } from './enums';

/** One row = one kit that is bought together (e.g. 2 x 8 GB). */
export const ramKits = pgTable('ram_kits', {
  ...partColumns,
  memoryType: memoryTypeEnum().notNull(),
  /** Total capacity of the whole kit. */
  capacityGb: integer().notNull(),
  /** Number of sticks in the kit; each stick uses one motherboard slot. */
  moduleCount: integer().notNull(),
  speedMhz: integer().notNull(),
});

export type RamKit = typeof ramKits.$inferSelect;
