import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// Used only by the `db:generate` and `db:migrate` commands.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  casing: 'snake_case',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
