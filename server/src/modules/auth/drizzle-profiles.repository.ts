import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { profiles } from '../../db/schema';
import type { ProfilesRepository } from './profiles.repository';

async function findById(id: string) {
  const [row] = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
  return row;
}

export function createDrizzleProfilesRepository(): ProfilesRepository {
  return {
    async getOrCreate({ id, email }) {
      // Usual case first: one query. Only a brand-new user costs an insert.
      const existing = await findById(id);
      if (existing) return existing;

      // onConflictDoNothing covers two first requests from the same new user arriving together.
      await db.insert(profiles).values({ id, email }).onConflictDoNothing();
      const created = await findById(id);
      if (!created) throw new Error(`Could not create a profile for user ${id}`);
      return created;
    },

    async list() {
      return db.select().from(profiles).orderBy(asc(profiles.createdAt));
    },

    async setRole(id, role) {
      const [row] = await db.update(profiles).set({ role }).where(eq(profiles.id, id)).returning();
      return row;
    },
  };
}
