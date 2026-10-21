import type { cpus, coolers, gpus, motherboards, pcCases, psus, ramKits, storageDrives } from './schema';

/*
 * SAMPLE DATA for development. Specs are approximate and prices are rough Thai baht,
 * so verify against the manufacturer before treating any of it as accurate.
 * The mix is deliberate: it contains parts that fit together AND parts that do not,
 * so the compatibility rules in phase 2 have something to catch.
 */

type Insert<T extends { $inferInsert: unknown }> = T['$inferInsert'];

export const cpuSeed: Insert<typeof cpus>[] = [
  { brand: 'AMD', name: 'Ryzen 5 5600', priceThb: 3500, socket: 'AM4', memoryTypes: ['DDR4'], cores: 6, threads: 12, baseClockGhz: 3.5, tdpWatts: 65, hasIntegratedGpu: false },
  { brand: 'AMD', name: 'Ryzen 5 7600', priceThb: 7500, socket: 'AM5', memoryTypes: ['DDR5'], cores: 6, threads: 12, baseClockGhz: 3.8, tdpWatts: 65, hasIntegratedGpu: true },
  { brand: 'Intel', name: 'Core i5-12400F', priceThb: 4500, socket: 'LGA1700', memoryTypes: ['DDR4', 'DDR5'], cores: 6, threads: 12, baseClockGhz: 2.5, tdpWatts: 65, hasIntegratedGpu: false },
  { brand: 'Intel', name: 'Core i7-14700K', priceThb: 14500, socket: 'LGA1700', memoryTypes: ['DDR4', 'DDR5'], cores: 20, threads: 28, baseClockGhz: 3.4, tdpWatts: 125, hasIntegratedGpu: true },
];

export const motherboardSeed: Insert<typeof motherboards>[] = [
  { brand: 'MSI', name: 'B550M PRO-VDH WIFI', priceThb: 3500, socket: 'AM4', chipset: 'B550', formFactor: 'mATX', memoryType: 'DDR4', memorySlots: 4, maxMemoryGb: 128, m2Slots: 2, sataPorts: 4, pcieX16Slots: 1 },
  { brand: 'ASUS', name: 'PRIME B650M-A', priceThb: 4800, socket: 'AM5', chipset: 'B650', formFactor: 'mATX', memoryType: 'DDR5', memorySlots: 4, maxMemoryGb: 192, m2Slots: 2, sataPorts: 4, pcieX16Slots: 1 },
  { brand: 'MSI', name: 'PRO B760M-P DDR4', priceThb: 3600, socket: 'LGA1700', chipset: 'B760', formFactor: 'mATX', memoryType: 'DDR4', memorySlots: 4, maxMemoryGb: 128, m2Slots: 2, sataPorts: 4, pcieX16Slots: 1 },
  { brand: 'ASUS', name: 'PRIME Z790-P', priceThb: 7500, socket: 'LGA1700', chipset: 'Z790', formFactor: 'ATX', memoryType: 'DDR5', memorySlots: 4, maxMemoryGb: 192, m2Slots: 3, sataPorts: 4, pcieX16Slots: 1 },
  { brand: 'Gigabyte', name: 'B650I AORUS ULTRA', priceThb: 9500, socket: 'AM5', chipset: 'B650', formFactor: 'ITX', memoryType: 'DDR5', memorySlots: 2, maxMemoryGb: 96, m2Slots: 2, sataPorts: 4, pcieX16Slots: 1 },
];

export const ramSeed: Insert<typeof ramKits>[] = [
  { brand: 'Corsair', name: 'Vengeance LPX 16GB (2x8GB) DDR4-3200', priceThb: 1400, memoryType: 'DDR4', capacityGb: 16, moduleCount: 2, speedMhz: 3200 },
  { brand: 'Corsair', name: 'Vengeance 32GB (2x16GB) DDR4-3600', priceThb: 2500, memoryType: 'DDR4', capacityGb: 32, moduleCount: 2, speedMhz: 3600 },
  { brand: 'Kingston', name: 'Fury Beast 32GB (2x16GB) DDR5-5600', priceThb: 3200, memoryType: 'DDR5', capacityGb: 32, moduleCount: 2, speedMhz: 5600 },
];

export const gpuSeed: Insert<typeof gpus>[] = [
  { brand: 'NVIDIA', name: 'GeForce RTX 4060', priceThb: 10500, vramGb: 8, lengthMm: 240, slotWidth: 2, tdpWatts: 115, recommendedPsuWatts: 550, pcie8PinCount: 1, uses12vhpwr: false },
  { brand: 'NVIDIA', name: 'GeForce RTX 4070 SUPER', priceThb: 21500, vramGb: 12, lengthMm: 267, slotWidth: 2, tdpWatts: 220, recommendedPsuWatts: 650, pcie8PinCount: 0, uses12vhpwr: true },
  { brand: 'AMD', name: 'Radeon RX 7800 XT', priceThb: 17500, vramGb: 16, lengthMm: 320, slotWidth: 2.5, tdpWatts: 263, recommendedPsuWatts: 700, pcie8PinCount: 2, uses12vhpwr: false },
];

export const storageSeed: Insert<typeof storageDrives>[] = [
  { brand: 'Samsung', name: '980 1TB NVMe', priceThb: 2400, interface: 'nvme', capacityGb: 1000 },
  { brand: 'WD', name: 'Blue SN580 500GB NVMe', priceThb: 1300, interface: 'nvme', capacityGb: 500 },
  { brand: 'Crucial', name: 'MX500 500GB SATA', priceThb: 1500, interface: 'sata', capacityGb: 500 },
];

export const psuSeed: Insert<typeof psus>[] = [
  { brand: 'Corsair', name: 'CV550', priceThb: 1700, wattage: 550, formFactor: 'ATX', efficiency: '80+ Bronze', pcie8PinCount: 2, hasNative12vhpwr: false },
  { brand: 'Corsair', name: 'RM750e', priceThb: 4200, wattage: 750, formFactor: 'ATX', efficiency: '80+ Gold', pcie8PinCount: 4, hasNative12vhpwr: true },
  { brand: 'Corsair', name: 'SF650', priceThb: 5200, wattage: 650, formFactor: 'SFX', efficiency: '80+ Platinum', pcie8PinCount: 2, hasNative12vhpwr: false },
];

export const caseSeed: Insert<typeof pcCases>[] = [
  { brand: 'NZXT', name: 'H5 Flow', priceThb: 3200, motherboardFormFactors: ['ATX', 'mATX', 'ITX'], psuFormFactors: ['ATX'], maxGpuLengthMm: 365, maxCoolerHeightMm: 165 },
  { brand: 'Cooler Master', name: 'MasterBox Q300L', priceThb: 1500, motherboardFormFactors: ['mATX', 'ITX'], psuFormFactors: ['ATX'], maxGpuLengthMm: 360, maxCoolerHeightMm: 159 },
  { brand: 'Cooler Master', name: 'NR200P', priceThb: 3600, motherboardFormFactors: ['ITX'], psuFormFactors: ['SFX'], maxGpuLengthMm: 330, maxCoolerHeightMm: 155 },
];

export const coolerSeed: Insert<typeof coolers>[] = [
  { brand: 'Thermalright', name: 'Peerless Assassin 120 SE', priceThb: 1100, supportedSockets: ['AM4', 'AM5', 'LGA1700'], heightMm: 155, maxTdpWatts: 245 },
  { brand: 'AMD', name: 'Wraith Stealth', priceThb: 500, supportedSockets: ['AM4', 'AM5'], heightMm: 54, maxTdpWatts: 65 },
  { brand: 'Noctua', name: 'NH-L9i-17xx', priceThb: 1800, supportedSockets: ['LGA1700'], heightMm: 37, maxTdpWatts: 65 },
];
