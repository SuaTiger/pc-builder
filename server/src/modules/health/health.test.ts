import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { HealthResponse } from '@pc-builder/shared';
import { createApp } from '../../app';
import { createTestDependencies } from '../../test/dependencies';

const app = createApp(createTestDependencies());

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    const body = res.body as HealthResponse;
    expect(body.status).toBe('ok');
    expect(typeof body.uptimeSeconds).toBe('number');
  });

  it('returns 404 JSON for unknown routes', async () => {
    const res = await request(app).get('/api/nope');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
