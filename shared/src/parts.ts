/** Every kind of component a build can contain. Add a new category here first. */
export const PART_CATEGORIES = [
  'cpu',
  'motherboard',
  'ram',
  'gpu',
  'storage',
  'psu',
  'case',
  'cooler',
] as const;

export type PartCategory = (typeof PART_CATEGORIES)[number];

/*
 * Values that decide whether two parts fit together.
 * The database enums, the compatibility rules and the UI dropdowns all read these lists,
 * so adding a new socket here is the only change needed to support it everywhere.
 */

/** A CPU only fits a motherboard (and cooler) that lists the same socket. */
export const SOCKETS = ['AM4', 'AM5', 'LGA1700', 'LGA1851'] as const;
export type Socket = (typeof SOCKETS)[number];

/** DDR4 and DDR5 sticks are physically different and cannot be swapped. */
export const MEMORY_TYPES = ['DDR4', 'DDR5'] as const;
export type MemoryType = (typeof MEMORY_TYPES)[number];

export const MOTHERBOARD_FORM_FACTORS = ['ATX', 'mATX', 'ITX'] as const;
export type MotherboardFormFactor = (typeof MOTHERBOARD_FORM_FACTORS)[number];

export const PSU_FORM_FACTORS = ['ATX', 'SFX'] as const;
export type PsuFormFactor = (typeof PSU_FORM_FACTORS)[number];

/** sata = 2.5" drive on a SATA port, nvme = M.2 stick in an M.2 slot. */
export const STORAGE_INTERFACES = ['sata', 'nvme'] as const;
export type StorageInterface = (typeof STORAGE_INTERFACES)[number];
