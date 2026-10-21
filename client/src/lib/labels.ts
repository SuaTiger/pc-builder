import type { PartCategory } from '@pc-builder/shared';

/** `Record<PartCategory, ...>` makes TypeScript require a label whenever a category is added. */
export const CATEGORY_LABELS: Record<PartCategory, string> = {
  cpu: 'Processor',
  motherboard: 'Motherboard',
  ram: 'Memory',
  gpu: 'Graphics card',
  storage: 'Storage',
  psu: 'Power supply',
  case: 'Case',
  cooler: 'CPU cooler',
};
