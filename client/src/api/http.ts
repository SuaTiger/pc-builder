import type { ErrorResponse } from '@pc-builder/shared';
import { env } from '../lib/env';
import { supabase } from '../lib/supabase';

/** An error answered by (or on the way to) our API. status 0 means the server was unreachable. */
export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

/**
 * The only place the browser talks to our API. It attaches the login token when there is one,
 * so a call works the same whether or not the endpoint needs a login.
 */
export async function apiRequest<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  // getSession() also refreshes an expired token, so we never send a stale one.
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.');
  }

  if (response.status === 204) return undefined as T;

  const payload: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const error = payload as Partial<ErrorResponse> | undefined;
    throw new ApiError(response.status, error?.error ?? response.statusText, error?.details);
  }
  return payload as T;
}

/** Turns anything thrown into text for the screen. */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Try again.';
}
