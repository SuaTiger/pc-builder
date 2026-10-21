import { Router } from 'express';
import { z } from 'zod';
import { PART_CATEGORIES, type ErrorResponse, type PartsResponse } from '@pc-builder/shared';
import { asyncHandler } from '../../middleware/async-handler';
import type { PartsRepository } from './parts.repository';

const categorySchema = z.enum(PART_CATEGORIES);

/** GET /api/parts/:category lists every part of one category. */
export function createPartsRouter(parts: PartsRepository) {
  const router = Router();

  router.get(
    '/:category',
    asyncHandler(async (req, res) => {
      const category = categorySchema.safeParse(req.params.category);
      if (!category.success) {
        const body: ErrorResponse = {
          error: `Unknown category "${req.params.category}"`,
          details: { validCategories: PART_CATEGORIES },
        };
        res.status(404).json(body);
        return;
      }

      const body: PartsResponse = {
        category: category.data,
        parts: await parts.listByCategory(category.data),
      };
      res.json(body);
    }),
  );

  return router;
}
