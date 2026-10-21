import type { PartCategory, SavedBuildDetail } from '@pc-builder/shared';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { isEmptyBuild } from './build-state';
import { BuildDiagram } from './BuildDiagram';
import { BuildSummary } from './BuildSummary';
import { FpsPanel } from './FpsPanel';
import { PartPicker } from './PartPicker';
import { SaveBuildForm } from './SaveBuildForm';
import { SlotRail } from './SlotRail';
import { useBuilder } from './use-builder';

/**
 * The three-column workspace: slots on the left, parts for the active slot in the middle,
 * totals and problems on the right. `saved` is set when editing a build that was saved earlier.
 */
export function Builder({ saved }: { saved?: SavedBuildDetail }) {
  const builder = useBuilder(saved?.build);
  const [category, setCategory] = useState<PartCategory>('cpu');

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)_20rem]">
      <div>
        <div className="mb-4">
          <BuildDiagram build={builder.build} report={builder.report} />
        </div>
        <SlotRail
          build={builder.build}
          report={builder.report}
          active={category}
          onActivate={setCategory}
          onRemove={builder.remove}
        />
        {!isEmptyBuild(builder.build) && (
          <Button variant="ghost" className="mt-3" onClick={builder.reset}>
            Start over
          </Button>
        )}
      </div>

      <PartPicker
        category={category}
        build={builder.build}
        onSelect={(part) => builder.select(category, part)}
      />

      <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
        <BuildSummary
          build={builder.build}
          report={builder.report}
          totalPriceThb={builder.totalPriceThb}
          estimatedWatts={builder.estimatedWatts}
        />
        <FpsPanel build={builder.build} />
        <SaveBuildForm build={builder.build} savedId={saved?.id} initialName={saved?.name} />
      </aside>
    </div>
  );
}
