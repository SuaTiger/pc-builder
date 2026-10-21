/** Shown instead of the app when required settings are missing, so the page is never just blank. */
export function SetupNotice({ missing }: { missing: string[] }) {
  return (
    <main className="mx-auto max-w-prose px-4 py-16">
      <h1 className="title-wide text-2xl font-bold">Finish setting up the front end</h1>
      <p className="mt-4">
        These settings are empty: <strong>{missing.join(', ')}</strong>.
      </p>
      <p className="mt-2">
        Copy <code>client/.env.example</code> to <code>client/.env</code>, fill in the values from
        your Supabase dashboard (Project Settings, API), then restart <code>npm run dev</code>.
      </p>
    </main>
  );
}
