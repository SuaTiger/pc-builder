import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { partColumns } from './common';
import { psuFormFactorEnum } from './enums';

export const psus = pgTable('psus', {
  ...partColumns,
  wattage: integer().notNull(),
  formFactor: psuFormFactorEnum().notNull(),
  efficiency: text().notNull(),
  /** How many 8-pin PCIe cables the PSU provides (compare with the GPU's pcie8PinCount). */
  pcie8PinCount: integer().notNull(),
  hasNative12vhpwr: boolean().notNull().default(false),
});

export type Psu = typeof psus.$inferSelect;
