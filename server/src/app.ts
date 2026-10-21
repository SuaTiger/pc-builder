import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { createBuildsRouter } from './modules/builds/builds.routes';
import { healthRouter } from './modules/health/health.routes';
import { createPartsRouter } from './modules/parts/parts.routes';
import type { PartsRepository } from './modules/parts/parts.repository';
import { createAdminRouter } from './modules/admin/admin.routes';
import { createAuth } from './modules/auth/auth.middleware';
import { createMeRouter } from './modules/auth/me.routes';
import type { ProfilesRepository } from './modules/auth/profiles.repository';
import type { TokenVerifier } from './modules/auth/token-verifier';
import { createSavedBuildsRouter } from './modules/saved-builds/saved-builds.routes';
import type { SavedBuildsRepository } from './modules/saved-builds/saved-builds.repository';

/** Everything the app needs from the outside world. Tests pass fakes here. */
export interface AppDependencies {
  parts: PartsRepository;
  tokenVerifier: TokenVerifier;
  profiles: ProfilesRepository;
  savedBuilds: SavedBuildsRepository;
}

/**
 * Builds the Express app without starting it, so tests can use it directly.
 * Each feature lives in `modules/<name>` and is mounted here with one line.
 */
export function createApp({ parts, tokenVerifier, profiles, savedBuilds }: AppDependencies) {
  const app = express();
  const auth = createAuth({ tokenVerifier, profiles });

  app.use(cors({ origin: env.CLIENT_ORIGIN }));
  app.use(express.json());

  app.use('/api/health', healthRouter);
  app.use('/api/parts', createPartsRouter(parts));
  app.use('/api/builds', createBuildsRouter(parts)); // public: anyone can check a build

  // Everything below requires a login. Order matters: the more specific path comes first.
  app.use(
    '/api/me/builds',
    auth.authenticate,
    auth.authorize('build:manage-own'),
    createSavedBuildsRouter({ parts, savedBuilds }),
  );
  app.use('/api/me', auth.authenticate, createMeRouter());
  app.use('/api/admin', auth.authenticate, auth.authorize('user:manage'), createAdminRouter(profiles));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
