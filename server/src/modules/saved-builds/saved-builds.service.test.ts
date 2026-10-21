import { describe, expect, it } from 'vitest';
import { createTestRepository, fullSelection, ids, uuid } from '../../test/fixtures';
import { resolveBuild } from '../builds/builds.service';
import type { SavedBuild } from './saved-builds.repository';
import { toDetail, toSummary } from './saved-builds.service';

const saved: SavedBuild = {
  id: uuid(500),
  userId: uuid(101),
  name: 'My PC',
  selection: fullSelection,
  createdAt: new Date('2026-10-13T00:00:00.000Z'),
  updatedAt: new Date('2026-10-13T01:00:00.000Z'),
};

describe('toSummary', () => {
  it('turns dates into ISO strings and hides the owner id', () => {
    const summary = toSummary(saved);

    expect(summary.createdAt).toBe('2026-10-13T00:00:00.000Z');
    expect(summary.updatedAt).toBe('2026-10-13T01:00:00.000Z');
    expect('userId' in summary).toBe(false);
  });
});

describe('toDetail', () => {
  it('adds a fresh compatibility report and total price', async () => {
    const resolved = await resolveBuild(createTestRepository(), saved.selection);
    const detail = toDetail(saved, resolved);

    expect(detail.report).toEqual({ ok: true, issues: [] });
    expect(detail.totalPriceThb).toBe(12100);
    expect(detail.missingParts).toEqual([]);
  });

  it('lists parts that were deleted since the build was saved', async () => {
    const stale = { ...saved, selection: { gpuId: ids.unknown } };
    const resolved = await resolveBuild(createTestRepository(), stale.selection);
    const detail = toDetail(stale, resolved);

    expect(detail.missingParts).toEqual([{ category: 'gpu', id: ids.unknown }]);
  });
});
