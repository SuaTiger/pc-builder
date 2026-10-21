import type { Request, RequestHandler, Response } from 'express';

/**
 * Wraps an async route so a thrown error reaches the error handler instead of being lost.
 * (Newer Express versions do this by themselves; this keeps it explicit and version-proof.)
 */
export const asyncHandler =
  (handler: (req: Request, res: Response) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    handler(req, res).catch(next);
  };
