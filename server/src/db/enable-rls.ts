import { queryClient } from './client';

/**
 * Turns on Row Level Security for every table in the public schema.
 *
 * Why: Supabase also serves tables in `public` through its own REST API, which anyone holding
 * the (public) anon key can call. With RLS on and no policies, that API can see nothing.
 * Our server is unaffected because it connects straight to Postgres with a role that bypasses RLS.
 * Safe to run repeatedly. Run it after every `db:migrate`, since new tables start with RLS off.
 */
async function enableRls() {
  await queryClient.unsafe(`
    do $$
    declare t record;
    begin
      for t in select tablename from pg_tables where schemaname = 'public' loop
        execute format('alter table public.%I enable row level security', t.tablename);
      end loop;
    end $$;
  `);

  const rows = await queryClient`
    select tablename, rowsecurity from pg_tables where schemaname = 'public' order by tablename
  `;
  for (const row of rows) {
    console.log(`${row.rowsecurity ? 'RLS on ' : 'RLS OFF'}  ${row.tablename}`);
  }
}

enableRls()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => queryClient.end());
