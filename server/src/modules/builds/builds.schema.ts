import { z } from 'zod';
import type { BuildSelection } from '@pc-builder/shared';

const id = z.string().uuid();

/**
 * Validates the body of POST /api/builds/check.
 * Typed as ZodType<BuildSelection> so it must stay in sync with the shared type.
 * `.strict()` rejects unknown fields, which catches typos like "cpuID" instead of ignoring them.
 */
export const buildSelectionSchema: z.ZodType<BuildSelection> = z
  .object({
    cpuId: id.optional(),
    motherboardId: id.optional(),
    ramId: id.optional(),
    gpuId: id.optional(),
    storageIds: z.array(id).max(8).optional(),
    psuId: id.optional(),
    caseId: id.optional(),
    coolerId: id.optional(),
  })
  .strict();
