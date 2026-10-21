import {
  PART_CATEGORIES,
  type Build,
  type BuildSelection,
  type CompatibilityReport,
  type PartCategory,
  type PartSpecByCategory,
  type StorageSpec,
} from '@pc-builder/shared';

/*
 * Pure functions that change a Build. They never modify the build they receive and return a
 * new one instead, which is what lets React notice the change.
 */

export type AnyPartSpec = PartSpecByCategory[PartCategory];

/** Puts a part into its slot. A single-part slot is replaced; storage adds another drive. */
export function withPart<C extends PartCategory>(
  build: Build,
  category: C,
  part: PartSpecByCategory[C],
): Build {
  if (category === 'storage') {
    return { ...build, storage: [...(build.storage ?? []), part as StorageSpec] };
  }
  return { ...build, [category]: part } as Build;
}

/** Empties a slot. For storage, `storageIndex` removes one drive; without it all drives go. */
export function withoutPart(build: Build, category: PartCategory, storageIndex?: number): Build {
  const next: Build = { ...build };
  if (category !== 'storage') {
    delete next[category];
    return next;
  }
  if (storageIndex === undefined) {
    delete next.storage;
  } else {
    next.storage = (build.storage ?? []).filter((_drive, index) => index !== storageIndex);
  }
  return next;
}

/** The parts currently in a slot: none, one, or (for storage) several. */
export function partsInSlot(build: Build, category: PartCategory): AnyPartSpec[] {
  if (category === 'storage') return build.storage ?? [];
  const part = build[category];
  return part ? [part] : [];
}

export function isEmptyBuild(build: Build): boolean {
  return PART_CATEGORIES.every((category) => partsInSlot(build, category).length === 0);
}

/** What the API stores: the ids of the chosen parts, not their specs. */
export function toSelection(build: Build): BuildSelection {
  return {
    cpuId: build.cpu?.id,
    motherboardId: build.motherboard?.id,
    ramId: build.ram?.id,
    gpuId: build.gpu?.id,
    storageIds: (build.storage ?? []).map((drive) => drive.id),
    psuId: build.psu?.id,
    caseId: build.case?.id,
    coolerId: build.cooler?.id,
  };
}

export type SlotStatus = 'empty' | 'ok' | 'warning' | 'error';

/** Colour of a slot's pins: empty, fits, worth checking, or does not fit. */
export function slotStatus(
  build: Build,
  category: PartCategory,
  report: CompatibilityReport,
): SlotStatus {
  if (partsInSlot(build, category).length === 0) return 'empty';

  const related = report.issues.filter((issue) => issue.categories.includes(category));
  if (related.some((issue) => issue.severity === 'error')) return 'error';
  return related.length > 0 ? 'warning' : 'ok';
}
