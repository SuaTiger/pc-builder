import { describe, expect, it } from 'vitest';
import { allRules, checkBuild } from './index';
import { cooler, cpu, gpu, motherboard, pcCase, psu, ram, storage, validBuild, variant } from './test-fixtures';
import type { Build, Severity } from './types';

function severityOf(build: Build, ruleId: string): Severity | undefined {
  return checkBuild(build).issues.find((issue) => issue.ruleId === ruleId)?.severity;
}

describe('checkBuild', () => {
  it('accepts a fully compatible build with no issues', () => {
    expect(checkBuild(validBuild())).toEqual({ ok: true, issues: [] });
  });

  it('accepts an empty build, because unfinished is not invalid', () => {
    expect(checkBuild({})).toEqual({ ok: true, issues: [] });
  });

  it('stays ok when there are only warnings', () => {
    const report = checkBuild(variant({ cooler: cooler({ maxTdpWatts: 45 }) }));
    expect(report.issues).toHaveLength(1);
    expect(report.ok).toBe(true);
  });

  it('is not ok when there is an error', () => {
    expect(checkBuild(variant({ cpu: cpu({ socket: 'AM4' }) })).ok).toBe(false);
  });

  it('gives every rule a unique id', () => {
    const ids = allRules.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// Each row: description, the rule that must fire, its severity, and a build that breaks it.
const brokenBuilds: Array<[string, string, Severity, Build]> = [
  ['CPU and board sockets differ', 'cpu-motherboard-socket', 'error', variant({ cpu: cpu({ socket: 'AM4' }) })],
  ['CPU cannot use the board memory type', 'cpu-memory-support', 'error', variant({ cpu: cpu({ memoryTypes: ['DDR4'] }) })],
  ['RAM type differs from board', 'ram-memory-type', 'error', variant({ ram: ram({ memoryType: 'DDR4' }) })],
  ['more sticks than slots', 'ram-slots-and-capacity', 'error', variant({ ram: ram({ moduleCount: 8 }) })],
  ['more RAM than the board supports', 'ram-slots-and-capacity', 'error', variant({ ram: ram({ capacityGb: 256 }) })],
  [
    'board larger than case supports',
    'motherboard-case-form-factor',
    'error',
    variant({ motherboard: motherboard({ formFactor: 'ATX' }), case: pcCase({ motherboardFormFactors: ['mATX', 'ITX'] }) }),
  ],
  ['GPU too long for case', 'gpu-case-length', 'error', variant({ gpu: gpu({ lengthMm: 400 }) })],
  ['PSU lacks 8-pin cables', 'gpu-psu-connectors', 'error', variant({ psu: psu({ pcie8PinCount: 0 }) })],
  [
    'GPU 16-pin needs adapter',
    'gpu-psu-connectors',
    'warning',
    variant({ gpu: gpu({ pcie8PinCount: 0, uses12vhpwr: true }), psu: psu({ hasNative12vhpwr: false }) }),
  ],
  ['PSU form factor not supported by case', 'psu-case-form-factor', 'error', variant({ psu: psu({ formFactor: 'SFX' }) })],
  ['PSU below GPU recommendation', 'psu-wattage', 'error', variant({ psu: psu({ wattage: 450 }) })],
  [
    'PSU has little headroom',
    'psu-wattage',
    'warning',
    variant({ cpu: cpu({ tdpWatts: 125 }), gpu: gpu({ tdpWatts: 263, recommendedPsuWatts: 550 }), psu: psu({ wattage: 550 }) }),
  ],
  ['cooler lacks CPU socket', 'cooler-cpu-socket', 'error', variant({ cooler: cooler({ supportedSockets: ['AM4'] }) })],
  ['cooler weaker than CPU heat', 'cooler-tdp', 'warning', variant({ cooler: cooler({ maxTdpWatts: 45 }) })],
  ['cooler too tall for case', 'cooler-case-height', 'error', variant({ cooler: cooler({ heightMm: 180 }) })],
  [
    'too many NVMe drives',
    'storage-ports',
    'error',
    variant({ storage: [storage(), storage(), storage()] }),
  ],
  [
    'too many SATA drives',
    'storage-ports',
    'error',
    variant({ storage: Array.from({ length: 5 }, () => storage({ interface: 'sata' })) }),
  ],
  [
    'no video output at all',
    'display-output',
    'warning',
    variant({ cpu: cpu({ hasIntegratedGpu: false }), gpu: undefined }),
  ],
];

describe('rules', () => {
  for (const [description, ruleId, severity, build] of brokenBuilds) {
    it(`${ruleId}: ${description}`, () => {
      expect(severityOf(build, ruleId)).toBe(severity);
    });
  }

  it('every rule is covered by at least one broken build above', () => {
    const covered = new Set(brokenBuilds.map(([, ruleId]) => ruleId));
    for (const rule of allRules) {
      expect(covered.has(rule.id)).toBe(true);
    }
  });
});
