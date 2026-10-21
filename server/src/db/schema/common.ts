import { integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/** Columns every part table has. Spread it into each table so we write it only once. */
export const partColumns = {
  id: uuid().primaryKey().defaultRandom(),
  brand: text().notNull(),
  name: text().notNull(),
  /** Whole Thai baht. Prices here are rough sample values, not live prices. */
  priceThb: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
};
