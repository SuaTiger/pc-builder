import {
  checkBuild,
  type Build,
  type CompatibilityIssue,
  type PartCategory,
  type PartSpecByCategory,
} from '@pc-builder/shared';
import { withPart } from './build-state';

export interface Candidate<C extends PartCategory> {
  part: PartSpecByCategory[C];
  /** Problems that would appear on this category if the part were chosen. */
  issues: CompatibilityIssue[];
  /** False if choosing it would create an error. Warnings do not stop a part from fitting. */
  fits: boolean;
}

/**
 * For each part in a category, asks "what happens if I add this to the current build?"
 * by running the same rules the server uses on a copy of the build with the part in place.
 * Choosing a part for a single-part slot replaces the current one, so a conflict with the
 * part being replaced does not count against the candidates.
 */
export function annotateCandidates<C extends PartCategory>(
  build: Build,
  category: C,
  parts: PartSpecByCategory[C][],
): Candidate<C>[] {
  return parts.map((part) => {
    const report = checkBuild(withPart(build, category, part));
    const issues = report.issues.filter((issue) => issue.categories.includes(category));
    return { part, issues, fits: issues.every((issue) => issue.severity !== 'error') };
  });
}

/** Parts that fit first. Otherwise the original order is kept. */
export function fittingFirst<C extends PartCategory>(candidates: Candidate<C>[]): Candidate<C>[] {
  return [...candidates.filter((c) => c.fits), ...candidates.filter((c) => !c.fits)];
}
