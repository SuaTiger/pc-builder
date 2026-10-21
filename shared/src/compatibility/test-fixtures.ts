import type {
  CaseSpec,
  CoolerSpec,
  CpuSpec,
  GpuSpec,
  MotherboardSpec,
  PsuSpec,
  RamKitSpec,
  StorageSpec,
} from '../part-specs';
import type { Build } from './types';

/*
 * Test helpers. Each factory returns a valid part; tests override only the field
 * they want to break, which keeps every test focused on one rule.
 */

export const cpu = (o: Partial<CpuSpec> = {}): CpuSpec => ({
  id: 'cpu', brand: 'Test', name: 'CPU', priceThb: 0,
  socket: 'AM5', memoryTypes: ['DDR5'], cores: 6, threads: 12, baseClockGhz: 3.8,
  tdpWatts: 65, hasIntegratedGpu: true, ...o,
});

export const motherboard = (o: Partial<MotherboardSpec> = {}): MotherboardSpec => ({
  id: 'mb', brand: 'Test', name: 'Board', priceThb: 0,
  socket: 'AM5', chipset: 'B650', formFactor: 'mATX', memoryType: 'DDR5',
  memorySlots: 4, maxMemoryGb: 192, m2Slots: 2, sataPorts: 4, pcieX16Slots: 1, ...o,
});

export const ram = (o: Partial<RamKitSpec> = {}): RamKitSpec => ({
  id: 'ram', brand: 'Test', name: 'RAM', priceThb: 0,
  memoryType: 'DDR5', capacityGb: 32, moduleCount: 2, speedMhz: 5600, ...o,
});

export const gpu = (o: Partial<GpuSpec> = {}): GpuSpec => ({
  id: 'gpu', brand: 'Test', name: 'GPU', priceThb: 0,
  vramGb: 8, lengthMm: 240, slotWidth: 2, tdpWatts: 115, recommendedPsuWatts: 550,
  pcie8PinCount: 1, uses12vhpwr: false, ...o,
});

export const storage = (o: Partial<StorageSpec> = {}): StorageSpec => ({
  id: 'ssd', brand: 'Test', name: 'SSD', priceThb: 0,
  interface: 'nvme', capacityGb: 1000, ...o,
});

export const psu = (o: Partial<PsuSpec> = {}): PsuSpec => ({
  id: 'psu', brand: 'Test', name: 'PSU', priceThb: 0,
  wattage: 750, formFactor: 'ATX', efficiency: '80+ Gold', pcie8PinCount: 4,
  hasNative12vhpwr: true, ...o,
});

export const pcCase = (o: Partial<CaseSpec> = {}): CaseSpec => ({
  id: 'case', brand: 'Test', name: 'Case', priceThb: 0,
  motherboardFormFactors: ['ATX', 'mATX', 'ITX'], psuFormFactors: ['ATX'],
  maxGpuLengthMm: 365, maxCoolerHeightMm: 165, ...o,
});

export const cooler = (o: Partial<CoolerSpec> = {}): CoolerSpec => ({
  id: 'cooler', brand: 'Test', name: 'Cooler', priceThb: 0,
  supportedSockets: ['AM5'], heightMm: 155, maxTdpWatts: 245, ...o,
});

/** A complete build in which every rule passes. */
export const validBuild = (): Build => ({
  cpu: cpu(),
  motherboard: motherboard(),
  ram: ram(),
  gpu: gpu(),
  storage: [storage()],
  psu: psu(),
  case: pcCase(),
  cooler: cooler(),
});

/** The valid build with some slots replaced. */
export const variant = (changes: Partial<Build>): Build => ({ ...validBuild(), ...changes });
