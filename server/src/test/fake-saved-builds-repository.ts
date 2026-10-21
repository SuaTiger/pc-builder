import { randomUUID } from 'node:crypto';
import type {
  SavedBuild,
  SavedBuildsRepository,
} from '../modules/saved-builds/saved-builds.repository';

/** In-memory saved builds. Like the real one, every lookup is limited to the given user. */
export function createFakeSavedBuildsRepository(): SavedBuildsRepository {
  const builds = new Map<string, SavedBuild>();
  const owned = (userId: string, id: string) => {
    const build = builds.get(id);
    return build && build.userId === userId ? build : undefined;
  };

  return {
    async listByUser(userId) {
      return [...builds.values()].filter((build) => build.userId === userId);
    },
    async countByUser(userId) {
      return [...builds.values()].filter((build) => build.userId === userId).length;
    },
    async findOwned(userId, id) {
      return owned(userId, id);
    },
    async create(userId, input) {
      const now = new Date();
      const build: SavedBuild = { id: randomUUID(), userId, ...input, createdAt: now, updatedAt: now };
      builds.set(build.id, build);
      return build;
    },
    async updateOwned(userId, id, input) {
      const existing = owned(userId, id);
      if (!existing) return undefined;
      const updated = { ...existing, ...input, updatedAt: new Date() };
      builds.set(id, updated);
      return updated;
    },
    async deleteOwned(userId, id) {
      return owned(userId, id) ? builds.delete(id) : false;
    },
  };
}
