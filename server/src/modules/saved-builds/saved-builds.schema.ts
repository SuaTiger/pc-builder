import { z } from 'zod';
import type { SaveBuildRequest } from '@pc-builder/shared';
import { buildSelectionSchema } from '../builds/builds.schema';

export const saveBuildSchema: z.ZodType<SaveBuildRequest> = z
  .object({
    name: z.string().trim().min(1).max(80),
    selection: buildSelectionSchema,
  })
  .strict();

export const idParamSchema = z.string().uuid();
