import {
  cpu,
  motherboard,
  storage,
} from '@pc-builder/shared/src/compatibility/test-fixtures';
import { describe, expect, it } from 'vitest';
import { annotateCandidates, fittingFirst } from './candidates';

const am5Cpu = cpu({ id: 'am5' });
const am4Cpu = cpu({ id: 'am4', socket: 'AM4', memoryTypes: ['DDR4'] });

describe('annotateCandidates', () => {
  it('marks every part as fitting when nothing is chosen yet', () => {
    const result = annotateCandidates({}, 'cpu', [am5Cpu, am4Cpu]);

    expect(result.map((candidate) => candidate.fits)).toEqual([true, true]);
  });

  it('marks a part that conflicts with the build and says why', () => {
    const result = annotateCandidates({ motherboard: motherboard() }, 'cpu', [am5Cpu, am4Cpu]);

    expect(result.map((candidate) => candidate.fits)).toEqual([true, false]);
    // An AM4 CPU also uses DDR4, so the memory rule objects too: every conflict is reported.
    expect(result[1]?.issues.map((issue) => issue.ruleId)).toEqual([
      'cpu-motherboard-socket',
      'cpu-memory-support',
    ]);
  });

  it('does not count a conflict with the part it would replace', () => {
    // The build holds an AM4 CPU on an AM5 board (a conflict). Picking an AM5 CPU fixes it.
    const build = { cpu: am4Cpu, motherboard: motherboard() };
    const result = annotateCandidates(build, 'cpu', [am5Cpu]);

    expect(result[0]?.fits).toBe(true);
  });

  it('treats a new drive as an addition, so slot limits apply', () => {
    const build = { motherboard: motherboard({ m2Slots: 1 }), storage: [storage({ interface: 'nvme' })] };
    const result = annotateCandidates(build, 'storage', [
      storage({ id: 'nvme', interface: 'nvme' }),
      storage({ id: 'sata', interface: 'sata' }),
    ]);

    expect(result.map((candidate) => candidate.fits)).toEqual([false, true]);
  });

  it('does not change the build it was given', () => {
    const build = { motherboard: motherboard() };
    const before = JSON.stringify(build);
    annotateCandidates(build, 'cpu', [am5Cpu, am4Cpu]);

    expect(JSON.stringify(build)).toBe(before);
  });
});

describe('fittingFirst', () => {
  it('moves fitting parts to the front and keeps the order otherwise', () => {
    const build = { motherboard: motherboard() };
    const candidates = annotateCandidates(build, 'cpu', [
      cpu({ id: 'bad-1', socket: 'AM4', memoryTypes: ['DDR4'] }),
      cpu({ id: 'good-1' }),
      cpu({ id: 'bad-2', socket: 'AM4', memoryTypes: ['DDR4'] }),
      cpu({ id: 'good-2' }),
    ]);

    expect(fittingFirst(candidates).map((candidate) => candidate.part.id)).toEqual([
      'good-1',
      'good-2',
      'bad-1',
      'bad-2',
    ]);
  });
});
