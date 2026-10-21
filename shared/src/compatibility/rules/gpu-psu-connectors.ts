import { error, warning } from '../findings';
import type { Rule, RuleFinding } from '../types';

export const gpuPsuConnectors: Rule = {
  id: 'gpu-psu-connectors',
  check({ gpu, psu }) {
    if (!gpu || !psu) return [];

    const findings: RuleFinding[] = [];
    if (gpu.pcie8PinCount > psu.pcie8PinCount) {
      findings.push(
        error(
          `The graphics card needs ${gpu.pcie8PinCount} x 8-pin PCIe cables but the PSU has ${psu.pcie8PinCount}.`,
          'gpu',
          'psu',
        ),
      );
    }
    if (gpu.uses12vhpwr && !psu.hasNative12vhpwr) {
      findings.push(
        warning(
          'The graphics card uses a 16-pin (12VHPWR) connector; this PSU needs an adapter for it.',
          'gpu',
          'psu',
        ),
      );
    }
    return findings;
  },
};
