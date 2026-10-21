import * as part from '@pc-builder/shared/src/compatibility/test-fixtures';
import { createFakePartsRepository } from './fake-parts-repository';

/** Valid-looking UUIDs, because the API rejects ids that are not UUIDs. */
export const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

export const ids = {
  cpu: uuid(1),
  cpuAm4: uuid(2),
  motherboard: uuid(3),
  ram: uuid(4),
  gpu: uuid(5),
  storage: uuid(6),
  psu: uuid(7),
  case: uuid(8),
  cooler: uuid(9),
  unknown: uuid(99),
};

/** Prices add up to 12100 for one of each part: 1000+2000+300+5000+700+1500+1200+400. */
export function createTestRepository() {
  return createFakePartsRepository({
    cpu: [
      part.cpu({ id: ids.cpu, priceThb: 1000 }),
      part.cpu({ id: ids.cpuAm4, socket: 'AM4', memoryTypes: ['DDR4'], priceThb: 900 }),
    ],
    motherboard: [part.motherboard({ id: ids.motherboard, priceThb: 2000 })],
    ram: [part.ram({ id: ids.ram, priceThb: 300 })],
    gpu: [part.gpu({ id: ids.gpu, priceThb: 5000 })],
    storage: [part.storage({ id: ids.storage, priceThb: 700 })],
    psu: [part.psu({ id: ids.psu, priceThb: 1500 })],
    case: [part.pcCase({ id: ids.case, priceThb: 1200 })],
    cooler: [part.cooler({ id: ids.cooler, priceThb: 400 })],
  });
}

/** A selection naming one of every part; all of them are compatible. */
export const fullSelection = {
  cpuId: ids.cpu,
  motherboardId: ids.motherboard,
  ramId: ids.ram,
  gpuId: ids.gpu,
  storageIds: [ids.storage],
  psuId: ids.psu,
  caseId: ids.case,
  coolerId: ids.cooler,
};
