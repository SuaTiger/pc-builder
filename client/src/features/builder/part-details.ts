import type { PartCategory, PartSpecByCategory } from '@pc-builder/shared';
import { formatCapacity } from '../../lib/format';

/** How to describe each kind of part in a line of specs. Complete by construction: see below. */
const describers: { [C in PartCategory]: (part: PartSpecByCategory[C]) => string[] } = {
  cpu: (p) => [
    p.socket,
    `${p.cores} cores, ${p.threads} threads`,
    `${p.tdpWatts} W`,
    p.memoryTypes.join(' or '),
    ...(p.hasIntegratedGpu ? ['has integrated graphics'] : []),
  ],
  motherboard: (p) => [p.socket, p.chipset, p.formFactor, p.memoryType, `${p.memorySlots} memory slots`, `${p.m2Slots} M.2 slots`],
  ram: (p) => [p.memoryType, `${formatCapacity(p.capacityGb)} in ${p.moduleCount} sticks`, `${p.speedMhz} MHz`],
  gpu: (p) => [`${p.vramGb} GB memory`, `${p.lengthMm} mm long`, `${p.tdpWatts} W`, `PSU of ${p.recommendedPsuWatts} W or more`],
  storage: (p) => [p.interface === 'nvme' ? 'NVMe M.2' : 'SATA', formatCapacity(p.capacityGb)],
  psu: (p) => [`${p.wattage} W`, p.formFactor, p.efficiency, `${p.pcie8PinCount} 8-pin cables`],
  case: (p) => [
    `fits ${p.motherboardFormFactors.join(', ')} boards`,
    `graphics card up to ${p.maxGpuLengthMm} mm`,
    `cooler up to ${p.maxCoolerHeightMm} mm`,
  ],
  cooler: (p) => [p.supportedSockets.join(', '), `${p.heightMm} mm tall`, `handles ${p.maxTdpWatts} W`],
};
// `{ [C in PartCategory]: ... }` means adding a category to the shared list makes this object
// fail to compile until its describer is written, so no part type is ever shown blank.

export function describePart<C extends PartCategory>(category: C, part: PartSpecByCategory[C]): string[] {
  const describe = describers[category] as (part: PartSpecByCategory[C]) => string[];
  return describe(part);
}
