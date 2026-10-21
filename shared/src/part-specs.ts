import type {
  MemoryType,
  MotherboardFormFactor,
  PsuFormFactor,
  Socket,
  StorageInterface,
} from './parts';

/*
 * The facts about each part that compatibility rules need.
 * These are plain interfaces with no database code, so the browser can use them too.
 * The server has a compile-time check (schema/spec-check.ts) that database rows match.
 */

interface PartBase {
  id: string;
  brand: string;
  name: string;
  priceThb: number;
}

export interface CpuSpec extends PartBase {
  socket: Socket;
  memoryTypes: MemoryType[];
  cores: number;
  threads: number;
  baseClockGhz: number;
  tdpWatts: number;
  hasIntegratedGpu: boolean;
}

export interface MotherboardSpec extends PartBase {
  socket: Socket;
  chipset: string;
  formFactor: MotherboardFormFactor;
  memoryType: MemoryType;
  memorySlots: number;
  maxMemoryGb: number;
  m2Slots: number;
  sataPorts: number;
  pcieX16Slots: number;
}

export interface RamKitSpec extends PartBase {
  memoryType: MemoryType;
  capacityGb: number;
  moduleCount: number;
  speedMhz: number;
}

export interface GpuSpec extends PartBase {
  vramGb: number;
  lengthMm: number;
  slotWidth: number;
  tdpWatts: number;
  recommendedPsuWatts: number;
  pcie8PinCount: number;
  uses12vhpwr: boolean;
}

export interface StorageSpec extends PartBase {
  interface: StorageInterface;
  capacityGb: number;
}

export interface PsuSpec extends PartBase {
  wattage: number;
  formFactor: PsuFormFactor;
  efficiency: string;
  pcie8PinCount: number;
  hasNative12vhpwr: boolean;
}

export interface CaseSpec extends PartBase {
  motherboardFormFactors: MotherboardFormFactor[];
  psuFormFactors: PsuFormFactor[];
  maxGpuLengthMm: number;
  maxCoolerHeightMm: number;
}

export interface CoolerSpec extends PartBase {
  supportedSockets: Socket[];
  heightMm: number;
  maxTdpWatts: number;
}

/**
 * Lets code say "the spec type for category C": PartSpecByCategory['cpu'] is CpuSpec.
 * If a category is added to PART_CATEGORIES but not here, code indexing this fails to compile.
 */
export interface PartSpecByCategory {
  cpu: CpuSpec;
  motherboard: MotherboardSpec;
  ram: RamKitSpec;
  gpu: GpuSpec;
  storage: StorageSpec;
  psu: PsuSpec;
  case: CaseSpec;
  cooler: CoolerSpec;
}
