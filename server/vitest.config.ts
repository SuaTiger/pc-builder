import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Tests never touch a real database; this only lets config/env.ts pass validation.
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_ANON_KEY: 'test-key',
    },
  },
});
