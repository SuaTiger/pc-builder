import type { Build } from './compatibility';

/** Sum of the prices of every picked part, in Thai baht. */
export function totalPriceThb(build: Build): number {
  const parts = [
    build.cpu,
    build.motherboard,
    build.ram,
    build.gpu,
    build.psu,
    build.case,
    build.cooler,
    ...(build.storage ?? []),
  ];
  return parts.reduce((sum, part) => sum + (part?.priceThb ?? 0), 0);
}
