import { error } from '../findings';
import type { Rule, RuleFinding } from '../types';

export const storagePorts: Rule = {
  id: 'storage-ports',
  check({ motherboard, storage = [] }) {
    if (!motherboard) return [];

    const nvmeCount = storage.filter((drive) => drive.interface === 'nvme').length;
    const sataCount = storage.filter((drive) => drive.interface === 'sata').length;

    const findings: RuleFinding[] = [];
    if (nvmeCount > motherboard.m2Slots) {
      findings.push(
        error(
          `${nvmeCount} NVMe drives selected but the motherboard has only ${motherboard.m2Slots} M.2 slots.`,
          'storage',
          'motherboard',
        ),
      );
    }
    if (sataCount > motherboard.sataPorts) {
      findings.push(
        error(
          `${sataCount} SATA drives selected but the motherboard has only ${motherboard.sataPorts} SATA ports.`,
          'storage',
          'motherboard',
        ),
      );
    }
    return findings;
  },
};
