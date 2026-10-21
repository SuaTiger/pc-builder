import type { Rule } from '../types';
import { coolerCaseHeight } from './cooler-case-height';
import { coolerCpuSocket } from './cooler-cpu-socket';
import { coolerTdp } from './cooler-tdp';
import { cpuMemorySupport } from './cpu-memory-support';
import { cpuMotherboardSocket } from './cpu-motherboard-socket';
import { displayOutput } from './display-output';
import { gpuCaseLength } from './gpu-case-length';
import { gpuPsuConnectors } from './gpu-psu-connectors';
import { motherboardCaseFormFactor } from './motherboard-case-form-factor';
import { psuCaseFormFactor } from './psu-case-form-factor';
import { psuWattage } from './psu-wattage';
import { ramMemoryType } from './ram-memory-type';
import { ramSlotsAndCapacity } from './ram-slots-and-capacity';
import { storagePorts } from './storage-ports';

/** To add a rule: create its file in this folder, then add it to this list. Nothing else changes. */
export const allRules: readonly Rule[] = [
  cpuMotherboardSocket,
  cpuMemorySupport,
  ramMemoryType,
  ramSlotsAndCapacity,
  motherboardCaseFormFactor,
  gpuCaseLength,
  gpuPsuConnectors,
  psuCaseFormFactor,
  psuWattage,
  coolerCpuSocket,
  coolerTdp,
  coolerCaseHeight,
  storagePorts,
  displayOutput,
];
