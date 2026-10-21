import type { BuildSelection } from '@pc-builder/shared';

export interface SavedBuild {
  id: string;
  userId: string;
  name: string;
  selection: BuildSelection;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedBuildInput {
  name: string;
  selection: BuildSelection;
}

/**
 * Every method takes the user's id and filters by it, so there is no way to ask for
 * "build 123" without also saying whose it must be. A build that belongs to someone else
 * looks exactly like a build that does not exist.
 */
export interface SavedBuildsRepository {
  listByUser(userId: string): Promise<SavedBuild[]>;
  countByUser(userId: string): Promise<number>;
  findOwned(userId: string, id: string): Promise<SavedBuild | undefined>;
  create(userId: string, input: SavedBuildInput): Promise<SavedBuild>;
  updateOwned(userId: string, id: string, input: SavedBuildInput): Promise<SavedBuild | undefined>;
  /** Returns false when nothing was deleted (no such build, or not the user's). */
  deleteOwned(userId: string, id: string): Promise<boolean>;
}
