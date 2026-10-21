import type { ErrorResponse } from '@pc-builder/shared';
import type { ZodError } from 'zod';

/** Turns a zod failure into the API's standard error body. */
export function validationErrorBody(error: ZodError): ErrorResponse {
  return {
    error: 'Invalid request',
    details: error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  };
}
