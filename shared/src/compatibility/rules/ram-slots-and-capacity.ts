import { error } from '../findings';
import type { Rule, RuleFinding } from '../types';

export const ramSlotsAndCapacity: Rule = {
  id: 'ram-slots-and-capacity',
  check({ ram, motherboard }) {
    if (!ram || !motherboard) return [];

    const findings: RuleFinding[] = [];
    if (ram.moduleCount > motherboard.memorySlots) {
      findings.push(
        error(
          `The kit has ${ram.moduleCount} sticks but the motherboard has only ${motherboard.memorySlots} memory slots.`,
          'ram',
          'motherboard',
        ),
      );
    }
    if (ram.capacityGb > motherboard.maxMemoryGb) {
      findings.push(
        error(
          `${ram.capacityGb} GB exceeds the motherboard maximum of ${motherboard.maxMemoryGb} GB.`,
          'ram',
          'motherboard',
        ),
      );
    }
    return findings;
  },
};
