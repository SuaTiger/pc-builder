import { Router } from 'express';
import type { ErrorResponse } from '@pc-builder/shared';
import { asyncHandler } from '../../middleware/async-handler';
import { validationErrorBody } from '../../middleware/validation-error';
import type { PartsRepository } from '../parts/parts.repository';
import { buildSelectionSchema } from './builds.schema';
import { resolveBuild, summarizeBuild } from './builds.service';

/** POST /api/builds/check takes part ids and returns the compatibility report. */
export function createBuildsRouter(parts: PartsRepository) {
  const router = Router();

  router.post(
    '/check',
    asyncHandler(async (req, res) => {
      const selection = buildSelectionSchema.safeParse(req.body);
      if (!selection.success) {
        res.status(400).json(validationErrorBody(selection.error));
        return;
      }

      const { build, missing } = await resolveBuild(parts, selection.data);
      if (missing.length > 0) {
        const body: ErrorResponse = { error: 'Some selected parts do not exist', details: missing };
        res.status(422).json(body);
        return;
      }

      res.json(summarizeBuild(build));
    }),
  );

  return router;
}
