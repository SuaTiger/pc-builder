import { and, count, desc, eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { savedBuilds } from '../../db/schema';
import type { SavedBuildsRepository } from './saved-builds.repository';

const ownedBy = (userId: string, id: string) =>
  and(eq(savedBuilds.id, id), eq(savedBuilds.userId, userId));

export function createDrizzleSavedBuildsRepository(): SavedBuildsRepository {
  return {
    async listByUser(userId) {
      return db
        .select()
        .from(savedBuilds)
        .where(eq(savedBuilds.userId, userId))
        .orderBy(desc(savedBuilds.updatedAt));
    },

    async countByUser(userId) {
      const [row] = await db
        .select({ value: count() })
        .from(savedBuilds)
        .where(eq(savedBuilds.userId, userId));
      return row?.value ?? 0;
    },

    async findOwned(userId, id) {
      const [row] = await db.select().from(savedBuilds).where(ownedBy(userId, id)).limit(1);
      return row;
    },

    async create(userId, input) {
      const [row] = await db.insert(savedBuilds).values({ userId, ...input }).returning();
      if (!row) throw new Error('Insert returned no row');
      return row;
    },

    async updateOwned(userId, id, input) {
      const [row] = await db
        .update(savedBuilds)
        .set({ ...input, updatedAt: new Date() })
        .where(ownedBy(userId, id))
        .returning();
      return row;
    },

    async deleteOwned(userId, id) {
      const deleted = await db
        .delete(savedBuilds)
        .where(ownedBy(userId, id))
        .returning({ id: savedBuilds.id });
      return deleted.length > 0;
    },
  };
}
