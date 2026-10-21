import {
  checkBuild,
  estimateSystemWatts,
  totalPriceThb,
  type Build,
  type BuildSelection,
  type CheckBuildResponse,
  type MissingPart,
  type PartCategory,
  type PartSpecByCategory,
} from '@pc-builder/shared';
import type { PartsRepository } from '../parts/parts.repository';

export interface ResolvedBuild {
  build: Build;
  /** Ids the client sent that do not exist in the database. */
  missing: MissingPart[];
}

/** Looks up ids of one category, keeping the order and duplicates the client sent. */
async function lookup<C extends PartCategory>(
  repo: PartsRepository,
  category: C,
  ids: string[],
): Promise<{ found: PartSpecByCategory[C][]; missing: MissingPart[] }> {
  const rows = await repo.findByIds(category, [...new Set(ids)]);
  const byId = new Map(rows.map((row) => [row.id, row] as const));

  const found: PartSpecByCategory[C][] = [];
  const missing: MissingPart[] = [];
  for (const id of ids) {
    const row = byId.get(id);
    if (row) found.push(row);
    else missing.push({ category, id });
  }
  return { found, missing };
}

const idList = (id: string | undefined) => (id ? [id] : []);

/** Turns the ids the client sent into full part specs. The 8 lookups run in parallel. */
export async function resolveBuild(
  repo: PartsRepository,
  selection: BuildSelection,
): Promise<ResolvedBuild> {
  const [cpu, motherboard, ram, gpu, storage, psu, pcCase, cooler] = await Promise.all([
    lookup(repo, 'cpu', idList(selection.cpuId)),
    lookup(repo, 'motherboard', idList(selection.motherboardId)),
    lookup(repo, 'ram', idList(selection.ramId)),
    lookup(repo, 'gpu', idList(selection.gpuId)),
    lookup(repo, 'storage', selection.storageIds ?? []),
    lookup(repo, 'psu', idList(selection.psuId)),
    lookup(repo, 'case', idList(selection.caseId)),
    lookup(repo, 'cooler', idList(selection.coolerId)),
  ]);

  return {
    build: {
      cpu: cpu.found[0],
      motherboard: motherboard.found[0],
      ram: ram.found[0],
      gpu: gpu.found[0],
      storage: storage.found,
      psu: psu.found[0],
      case: pcCase.found[0],
      cooler: cooler.found[0],
    },
    missing: [
      ...cpu.missing,
      ...motherboard.missing,
      ...ram.missing,
      ...gpu.missing,
      ...storage.missing,
      ...psu.missing,
      ...pcCase.missing,
      ...cooler.missing,
    ],
  };
}

/** Runs the shared rules and adds the totals the UI shows. Pure: no database access. */
export function summarizeBuild(build: Build): CheckBuildResponse {
  return {
    build,
    report: checkBuild(build),
    totalPriceThb: totalPriceThb(build),
    estimatedWatts: estimateSystemWatts(build),
  };
}
