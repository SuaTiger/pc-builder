import { Router, type Response } from 'express';
import type { ErrorResponse, SavedBuildsResponse } from '@pc-builder/shared';
import { asyncHandler } from '../../middleware/async-handler';
import { validationErrorBody } from '../../middleware/validation-error';
import { currentUser } from '../auth/auth.middleware';
import { resolveBuild } from '../builds/builds.service';
import type { PartsRepository } from '../parts/parts.repository';
import type { SavedBuildsRepository } from './saved-builds.repository';
import { idParamSchema, saveBuildSchema } from './saved-builds.schema';
import { MAX_SAVED_BUILDS, toDetail, toSummary } from './saved-builds.service';

const sendError = (res: Response, status: number, error: string, details?: unknown) => {
  const body: ErrorResponse = details === undefined ? { error } : { error, details };
  res.status(status).json(body);
};

/**
 * Mounted at /api/me/builds, behind authenticate + authorize('build:manage-own').
 * Every route acts on the logged-in user's builds only.
 */
export function createSavedBuildsRouter(deps: {
  parts: PartsRepository;
  savedBuilds: SavedBuildsRepository;
}) {
  const { parts, savedBuilds } = deps;
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const builds = await savedBuilds.listByUser(currentUser(req).id);
      const body: SavedBuildsResponse = { builds: builds.map(toSummary) };
      res.json(body);
    }),
  );

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const user = currentUser(req);
      const input = saveBuildSchema.safeParse(req.body);
      if (!input.success) {
        res.status(400).json(validationErrorBody(input.error));
        return;
      }

      // Refuse ids that do not exist. An incompatible build is fine: it can be a work in progress.
      const resolved = await resolveBuild(parts, input.data.selection);
      if (resolved.missing.length > 0) {
        sendError(res, 422, 'Some selected parts do not exist', resolved.missing);
        return;
      }
      if ((await savedBuilds.countByUser(user.id)) >= MAX_SAVED_BUILDS) {
        sendError(res, 403, `You can save at most ${MAX_SAVED_BUILDS} builds`);
        return;
      }

      const saved = await savedBuilds.create(user.id, input.data);
      res.status(201).json(toDetail(saved, resolved));
    }),
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = idParamSchema.safeParse(req.params.id);
      const saved = id.success ? await savedBuilds.findOwned(currentUser(req).id, id.data) : undefined;
      if (!saved) {
        sendError(res, 404, 'Build not found');
        return;
      }

      // Re-resolved on every read, so prices and compatibility are never stale.
      res.json(toDetail(saved, await resolveBuild(parts, saved.selection)));
    }),
  );

  router.put(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = idParamSchema.safeParse(req.params.id);
      const input = saveBuildSchema.safeParse(req.body);
      if (!input.success) {
        res.status(400).json(validationErrorBody(input.error));
        return;
      }

      const resolved = await resolveBuild(parts, input.data.selection);
      if (resolved.missing.length > 0) {
        sendError(res, 422, 'Some selected parts do not exist', resolved.missing);
        return;
      }

      const saved = id.success
        ? await savedBuilds.updateOwned(currentUser(req).id, id.data, input.data)
        : undefined;
      if (!saved) {
        sendError(res, 404, 'Build not found');
        return;
      }
      res.json(toDetail(saved, resolved));
    }),
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      const id = idParamSchema.safeParse(req.params.id);
      const deleted = id.success && (await savedBuilds.deleteOwned(currentUser(req).id, id.data));
      if (!deleted) {
        sendError(res, 404, 'Build not found');
        return;
      }
      res.status(204).end();
    }),
  );

  return router;
}
