import type {
  CaseSpec,
  CoolerSpec,
  CpuSpec,
  GpuSpec,
  MotherboardSpec,
  PsuSpec,
  RamKitSpec,
  StorageSpec,
} from '../part-specs';
import type { PartCategory } from '../parts';

/** The parts a user has picked so far. Every slot is optional because builds start empty. */
export interface Build {
  cpu?: CpuSpec;
  motherboard?: MotherboardSpec;
  ram?: RamKitSpec;
  gpu?: GpuSpec;
  storage?: StorageSpec[];
  psu?: PsuSpec;
  case?: CaseSpec;
  cooler?: CoolerSpec;
}

/**
 * error   = the parts cannot work together (wrong socket, does not fit in the case...).
 * warning = it can work, but probably should not (weak PSU, adapter needed...).
 */
export type Severity = 'error' | 'warning';

/** What a rule reports. The rule's id is added later by checkBuild. */
export interface RuleFinding {
  severity: Severity;
  message: string;
  /** Which parts are involved, so the UI can highlight them. */
  categories: PartCategory[];
}

export interface CompatibilityIssue extends RuleFinding {
  ruleId: string;
}

/**
 * One compatibility check. A rule must return no findings when a part it needs
 * has not been picked yet; an unfinished build is not an invalid build.
 */
export interface Rule {
  id: string;
  check(build: Build): RuleFinding[];
}

export interface CompatibilityReport {
  /** True when there are no errors. Warnings do not make a build invalid. */
  ok: boolean;
  issues: CompatibilityIssue[];
}
