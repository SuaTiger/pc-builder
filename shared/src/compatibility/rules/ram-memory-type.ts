import { error } from '../findings';
import type { Rule } from '../types';

export const ramMemoryType: Rule = {
  id: 'ram-memory-type',
  check({ ram, motherboard }) {
    if (!ram || !motherboard || ram.memoryType === motherboard.memoryType) return [];
    return [
      error(
        `${ram.memoryType} memory does not fit a ${motherboard.memoryType} motherboard.`,
        'ram',
        'motherboard',
      ),
    ];
  },
};
