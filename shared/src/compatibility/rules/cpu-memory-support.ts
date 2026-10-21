import { error } from '../findings';
import type { Rule } from '../types';

export const cpuMemorySupport: Rule = {
  id: 'cpu-memory-support',
  check({ cpu, motherboard }) {
    if (!cpu || !motherboard || cpu.memoryTypes.includes(motherboard.memoryType)) return [];
    return [
      error(
        `This CPU supports ${cpu.memoryTypes.join('/')} but the motherboard uses ${motherboard.memoryType}.`,
        'cpu',
        'motherboard',
      ),
    ];
  },
};
