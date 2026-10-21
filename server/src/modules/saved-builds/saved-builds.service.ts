import type { SavedBuildDetail, SavedBuildSummary } from '@pc-builder/shared';
import { summarizeBuild, type ResolvedBuild } from '../builds/builds.service';
import type { SavedBuild } from './saved-builds.repository';

/** Keeps one account from filling the free-tier database. */
export const MAX_SAVED_BUILDS = 50;

export function toSummary(build: SavedBuild): SavedBuildSummary {
  return {
    id: build.id,
    name: build.name,
    selection: build.selection,
    createdAt: build.createdAt.toISOString(),
    updatedAt: build.updatedAt.toISOString(),
  };
}

/** The saved record plus its parts and a compatibility check computed right now. */
export function toDetail(build: SavedBuild, resolved: ResolvedBuild): SavedBuildDetail {
  return {
    ...toSummary(build),
    ...summarizeBuild(resolved.build),
    missingParts: resolved.missing,
  };
}
