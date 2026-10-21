import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env';
import * as schema from './schema';

// `prepare: false` is required when connecting through Supabase's transaction pooler.
// It is harmless on the other connection types.
export const queryClient = postgres(env.DATABASE_URL, { prepare: false });

// `casing` lets us write camelCase in TypeScript (priceThb) and get snake_case in SQL (price_thb).
export const db = drizzle(queryClient, { schema, casing: 'snake_case' });
