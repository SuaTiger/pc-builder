import { describe, expect, it } from 'vitest';
import { totalPriceThb } from './build-summary';
import { cpu, storage } from './compatibility/test-fixtures';

describe('totalPriceThb', () => {
  it('is 0 for an empty build', () => {
    expect(totalPriceThb({})).toBe(0);
  });

  it('adds every part, counting each drive separately', () => {
    const build = {
      cpu: cpu({ priceThb: 1000 }),
      storage: [storage({ priceThb: 300 }), storage({ priceThb: 300 })],
    };
    expect(totalPriceThb(build)).toBe(1600);
  });
});
