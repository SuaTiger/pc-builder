import { boolean, integer, pgTable, real } from 'drizzle-orm/pg-core';
import { partColumns } from './common';
import { memoryTypeEnum, socketEnum } from './enums';

export const cpus = pgTable('cpus', {
  ...partColumns,
  socket: socketEnum().notNull(),
  /** A CPU can support several types (e.g. Intel 12th gen works with DDR4 and DDR5 boards). */
  memoryTypes: memoryTypeEnum().array().notNull(),
  cores: integer().notNull(),
  threads: integer().notNull(),
  baseClockGhz: real().notNull(),
  tdpWatts: integer().notNull(),
  hasIntegratedGpu: boolean().notNull().default(false),
});

export type Cpu = typeof cpus.$inferSelect;
