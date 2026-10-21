import {
  checkBuild,
  estimateSystemWatts,
  totalPriceThb,
  type Build,
  type PartCategory,
  type PartSpecByCategory,
} from '@pc-builder/shared';
import { useCallback, useMemo, useState } from 'react';
import { withoutPart, withPart } from './build-state';

/**
 * The build being edited, plus everything derived from it. The compatibility report, price
 * and power estimate are computed from the build each time it changes, never stored separately,
 * so they cannot disagree with it.
 */
export function useBuilder(initialBuild: Build = {}) {
  const [build, setBuild] = useState<Build>(initialBuild);

  const report = useMemo(() => checkBuild(build), [build]);

  const select = useCallback(
    <C extends PartCategory>(category: C, part: PartSpecByCategory[C]) =>
      setBuild((current) => withPart(current, category, part)),
    [],
  );
  const remove = useCallback(
    (category: PartCategory, storageIndex?: number) =>
      setBuild((current) => withoutPart(current, category, storageIndex)),
    [],
  );
  const reset = useCallback(() => setBuild({}), []);

  return {
    build,
    report,
    totalPriceThb: totalPriceThb(build),
    estimatedWatts: estimateSystemWatts(build),
    select,
    remove,
    reset,
  };
}
