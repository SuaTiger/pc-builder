import type {
  CaseSpec,
  CoolerSpec,
  CpuSpec,
  GpuSpec,
  MotherboardSpec,
  PsuSpec,
  RamKitSpec,
  StorageSpec,
} from '@pc-builder/shared';
import type { PcCase } from './case';
import type { Cooler } from './cooler';
import type { Cpu } from './cpu';
import type { Gpu } from './gpu';
import type { Motherboard } from './motherboard';
import type { Psu } from './psu';
import type { RamKit } from './ram';
import type { StorageDrive } from './storage';

/**
 * Compile-time guard, produces no runtime code. The compatibility rules read the *Spec types
 * from `shared`, but the database returns rows from these tables. If someone renames a column
 * or changes its type so a row no longer matches its spec, the line below stops compiling.
 */
type Assert<T extends true> = T;
type RowMatchesSpec<Row, Spec> = Row extends Spec ? true : false;

export type SchemaMatchesSpecs = [
  Assert<RowMatchesSpec<Cpu, CpuSpec>>,
  Assert<RowMatchesSpec<Motherboard, MotherboardSpec>>,
  Assert<RowMatchesSpec<RamKit, RamKitSpec>>,
  Assert<RowMatchesSpec<Gpu, GpuSpec>>,
  Assert<RowMatchesSpec<StorageDrive, StorageSpec>>,
  Assert<RowMatchesSpec<Psu, PsuSpec>>,
  Assert<RowMatchesSpec<PcCase, CaseSpec>>,
  Assert<RowMatchesSpec<Cooler, CoolerSpec>>,
];
