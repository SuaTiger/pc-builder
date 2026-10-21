import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { ErrorResponse, PartsResponse } from '@pc-builder/shared';
import { createApp } from '../../app';
import { createTestDependencies } from '../../test/dependencies';

const app = createApp(createTestDependencies());

describe('GET /api/parts/:category', () => {
  it('lists the parts of a category', async () => {
    const res = await request(app).get('/api/parts/cpu');
    const body = res.body as PartsResponse;

    expect(res.status).toBe(200);
    expect(body.category).toBe('cpu');
    expect(body.parts).toHaveLength(2);
  });

  it('returns 404 and the valid categories for an unknown one', async () => {
    const res = await request(app).get('/api/parts/toaster');

    expect(res.status).toBe(404);
    expect((res.body as ErrorResponse).details).toHaveProperty('validCategories');
  });
});
