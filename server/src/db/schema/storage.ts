import { integer, pgTable } from 'drizzle-orm/pg-core';
import { partColumns } from './common';
import { storageInterfaceEnum } from './enums';

/**
 * Simplification: 'nvme' always uses an M.2 slot and 'sata' always uses a SATA port.
 * (Real life has SATA M.2 drives too; we can add that later if needed.)
 */
export const storageDrives = pgTable('storage_drives', {
  ...partColumns,
  interface: storageInterfaceEnum().notNull(),
  capacityGb: integer().notNull(),
});

export type StorageDrive = typeof storageDrives.$inferSelect;
