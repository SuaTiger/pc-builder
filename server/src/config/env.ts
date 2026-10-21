import 'dotenv/config';
import { z } from 'zod';

/**
 * All environment variables are validated once at startup.
 * If one is missing or wrong, the server fails immediately with a clear message
 * instead of crashing later in a confusing place.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  // Postgres connection string from Supabase. Required: the app cannot work without a database.
  DATABASE_URL: z.string().url(),
  // Used only to ask Supabase "is this login token valid?". See docs/auth.md.
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
