import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { partColumns } from './common';
import { memoryTypeEnum, motherboardFormFactorEnum, socketEnum } from './enums';

export const motherboards = pgTable('motherboards', {
  ...partColumns,
  socket: socketEnum().notNull(),
  chipset: text().notNull(),
  formFactor: motherboardFormFactorEnum().notNull(),
  /** A board has one kind of RAM slot, unlike a CPU which may support several. */
  memoryType: memoryTypeEnum().notNull(),
  memorySlots: integer().notNull(),
  maxMemoryGb: integer().notNull(),
  m2Slots: integer().notNull(),
  sataPorts: integer().notNull(),
  pcieX16Slots: integer().notNull(),
});

export type Motherboard = typeof motherboards.$inferSelect;
