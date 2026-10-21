import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { userRoleEnum } from './enums';

/**
 * Our own record of each person who has logged in. Supabase Auth owns the password and the
 * login itself; this table owns what the person is allowed to do in our app.
 * A row is created automatically the first time someone makes an authenticated request.
 */
export const profiles = pgTable('profiles', {
  /** Same value as the user's id in Supabase Auth. We never generate it ourselves. */
  id: uuid().primaryKey(),
  email: text(),
  role: userRoleEnum().notNull().default('user'),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
