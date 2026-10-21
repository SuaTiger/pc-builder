import { createApp } from './app';
import { env } from './config/env';
import { createDrizzleProfilesRepository } from './modules/auth/drizzle-profiles.repository';
import { createSupabaseTokenVerifier } from './modules/auth/supabase-token-verifier';
import { createDrizzlePartsRepository } from './modules/parts/drizzle-parts.repository';
import { createDrizzleSavedBuildsRepository } from './modules/saved-builds/drizzle-saved-builds.repository';

// The only place that connects the app to the real database.
const app = createApp({
  parts: createDrizzlePartsRepository(),
  profiles: createDrizzleProfilesRepository(),
  savedBuilds: createDrizzleSavedBuildsRepository(),
  tokenVerifier: createSupabaseTokenVerifier({
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
  }),
});

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});
