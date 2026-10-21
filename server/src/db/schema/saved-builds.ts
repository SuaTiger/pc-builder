import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { BuildSelection } from '@pc-builder/shared';
import { profiles } from './profiles';

/**
 * A user's saved PC build. It stores only the ids the user picked (the same shape the API
 * receives), not copies of the specs, so prices and specs are always read fresh from the parts tables.
 * Trade-off: a jsonb column cannot have foreign keys, so a part deleted later is reported
 * as "missing" when the build is loaded instead of being blocked at delete time.
 */
export const savedBuilds = pgTable(
  'saved_builds',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    selection: jsonb().$type<BuildSelection>().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('saved_builds_user_id_idx').on(table.userId)],
);

export type SavedBuildRow = typeof savedBuilds.$inferSelect;
