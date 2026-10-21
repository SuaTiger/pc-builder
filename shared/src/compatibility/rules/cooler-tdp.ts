import { warning } from '../findings';
import type { Rule } from '../types';

export const coolerTdp: Rule = {
  id: 'cooler-tdp',
  check({ cooler, cpu }) {
    if (!cooler || !cpu || cooler.maxTdpWatts >= cpu.tdpWatts) return [];
    return [
      warning(
        `The cooler handles ${cooler.maxTdpWatts} W but the CPU can produce ${cpu.tdpWatts} W of heat.`,
        'cooler',
        'cpu',
      ),
    ];
  },
};
