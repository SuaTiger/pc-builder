import { integer, pgTable } from 'drizzle-orm/pg-core';
import { partColumns } from './common';
import { motherboardFormFactorEnum, psuFormFactorEnum } from './enums';

// `case` is a reserved word in JavaScript, so the table variable is `pcCases`.
export const pcCases = pgTable('cases', {
  ...partColumns,
  motherboardFormFactors: motherboardFormFactorEnum().array().notNull(),
  psuFormFactors: psuFormFactorEnum().array().notNull(),
  maxGpuLengthMm: integer().notNull(),
  maxCoolerHeightMm: integer().notNull(),
});

export type PcCase = typeof pcCases.$inferSelect;
