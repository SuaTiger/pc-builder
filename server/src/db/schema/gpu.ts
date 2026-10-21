import { boolean, integer, pgTable, real } from 'drizzle-orm/pg-core';
import { partColumns } from './common';

export const gpus = pgTable('gpus', {
  ...partColumns,
  vramGb: integer().notNull(),
  /** Must be no longer than the case's maxGpuLengthMm. */
  lengthMm: integer().notNull(),
  slotWidth: real().notNull(),
  tdpWatts: integer().notNull(),
  /** Wattage the manufacturer recommends for the whole system. */
  recommendedPsuWatts: integer().notNull(),
  /** Number of 8-pin PCIe power cables needed. */
  pcie8PinCount: integer().notNull().default(0),
  /** True if the card uses the single 12VHPWR / 16-pin connector. */
  uses12vhpwr: boolean().notNull().default(false),
});

export type Gpu = typeof gpus.$inferSelect;
