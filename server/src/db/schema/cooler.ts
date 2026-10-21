import { integer, pgTable } from 'drizzle-orm/pg-core';
import { partColumns } from './common';
import { socketEnum } from './enums';

export const coolers = pgTable('coolers', {
  ...partColumns,
  supportedSockets: socketEnum().array().notNull(),
  /** Must be no taller than the case's maxCoolerHeightMm. */
  heightMm: integer().notNull(),
  /** Heat the cooler can handle; should be at least the CPU's tdpWatts. */
  maxTdpWatts: integer().notNull(),
});

export type Cooler = typeof coolers.$inferSelect;
