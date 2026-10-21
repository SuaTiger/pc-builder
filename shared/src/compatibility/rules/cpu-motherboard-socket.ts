import { error } from '../findings';
import type { Rule } from '../types';

export const cpuMotherboardSocket: Rule = {
  id: 'cpu-motherboard-socket',
  check({ cpu, motherboard }) {
    if (!cpu || !motherboard || cpu.socket === motherboard.socket) return [];
    return [
      error(
        `CPU socket ${cpu.socket} does not match motherboard socket ${motherboard.socket}.`,
        'cpu',
        'motherboard',
      ),
    ];
  },
};
