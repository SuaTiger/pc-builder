import { error } from '../findings';
import type { Rule } from '../types';

export const coolerCpuSocket: Rule = {
  id: 'cooler-cpu-socket',
  check({ cooler, cpu }) {
    if (!cooler || !cpu || cooler.supportedSockets.includes(cpu.socket)) return [];
    return [
      error(
        `This cooler does not support socket ${cpu.socket} (supports ${cooler.supportedSockets.join(', ')}).`,
        'cooler',
        'cpu',
      ),
    ];
  },
};
