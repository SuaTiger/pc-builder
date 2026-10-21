import type { PgTable } from 'drizzle-orm/pg-core';
import type { PartCategory } from '@pc-builder/shared';
import { pcCases } from './case';
import { coolers } from './cooler';
import { cpus } from './cpu';
import { gpus } from './gpu';
import { motherboards } from './motherboard';
import { psus } from './psu';
import { ramKits } from './ram';
import { storageDrives } from './storage';

/**
 * Maps each category to its table. `satisfies Record<PartCategory, ...>` makes TypeScript
 * fail the build if someone adds a category in `shared` but forgets to create its table.
 */
export const partTables = {
  cpu: cpus,
  motherboard: motherboards,
  ram: ramKits,
  gpu: gpus,
  storage: storageDrives,
  psu: psus,
  case: pcCases,
  cooler: coolers,
} satisfies Record<PartCategory, PgTable>;
