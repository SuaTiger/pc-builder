import request from 'supertest';
import { describe, expect, it } from 'vitest';
import type { CheckBuildResponse, ErrorResponse } from '@pc-builder/shared';
import { createApp } from '../../app';
import { createTestDependencies } from '../../test/dependencies';
import { fullSelection, ids } from '../../test/fixtures';

const app = createApp(createTestDependencies());
const check = (body: unknown) => request(app).post('/api/builds/check').send(body as object);

describe('POST /api/builds/check', () => {
  it('accepts a compatible build and returns totals', async () => {
    const res = await check(fullSelection);
    const body = res.body as CheckBuildResponse;

    expect(res.status).toBe(200);
    expect(body.report.ok).toBe(true);
    expect(body.totalPriceThb).toBe(12100);
    expect(body.estimatedWatts).toBe(280);
  });

  it('returns 200 with ok=false for an incompatible build', async () => {
    const res = await check({ cpuId: ids.cpuAm4, motherboardId: ids.motherboard });
    const body = res.body as CheckBuildResponse;

    expect(res.status).toBe(200);
    expect(body.report.ok).toBe(false);
    expect(body.report.issues.map((issue) => issue.ruleId)).toContain('cpu-motherboard-socket');
  });

  it('counts the same drive each time it is listed', async () => {
    const res = await check({
      motherboardId: ids.motherboard,
      storageIds: [ids.storage, ids.storage, ids.storage],
    });
    const body = res.body as CheckBuildResponse;

    expect(body.report.issues.map((issue) => issue.ruleId)).toContain('storage-ports');
  });

  it('accepts an empty selection', async () => {
    const res = await check({});

    expect(res.status).toBe(200);
    expect((res.body as CheckBuildResponse).report).toEqual({ ok: true, issues: [] });
  });

  it('returns 422 listing ids that do not exist', async () => {
    const res = await check({ cpuId: ids.unknown });
    const body = res.body as ErrorResponse;

    expect(res.status).toBe(422);
    expect(body.details).toEqual([{ category: 'cpu', id: ids.unknown }]);
  });

  it('returns 400 for an id that is not a UUID', async () => {
    expect((await check({ cpuId: 'not-a-uuid' })).status).toBe(400);
  });

  it('returns 400 for unknown fields instead of ignoring them', async () => {
    expect((await check({ cpuID: ids.cpu })).status).toBe(400);
  });

  it('returns 400 for malformed JSON', async () => {
    const res = await request(app)
      .post('/api/builds/check')
      .set('Content-Type', 'application/json')
      .send('{ not json');

    expect(res.status).toBe(400);
  });
});
