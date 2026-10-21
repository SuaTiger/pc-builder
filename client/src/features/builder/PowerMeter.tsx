import type { Build } from '@pc-builder/shared';
import { formatWatts } from '../../lib/format';

/** Estimated power draw, compared with the chosen power supply once there is one. */
export function PowerMeter({ build, estimatedWatts }: { build: Build; estimatedWatts: number }) {
  const supply = build.psu?.wattage;

  if (estimatedWatts === 0) {
    return <p className="text-sm text-muted">Pick a processor or graphics card to estimate power use.</p>;
  }
  if (!supply) {
    return <p className="text-sm">Estimated power use: <strong>{formatWatts(estimatedWatts)}</strong></p>;
  }

  const share = estimatedWatts / supply;
  const barColor = share > 1 ? 'bg-fault' : share > 0.8 ? 'bg-caution' : 'bg-trace';

  return (
    <div>
      <p className="text-sm">
        Estimated power use: <strong>{formatWatts(estimatedWatts)}</strong> of {formatWatts(supply)}
      </p>
      <div
        role="meter"
        aria-label="Power use compared with the power supply"
        aria-valuemin={0}
        aria-valuemax={supply}
        aria-valuenow={Math.min(estimatedWatts, supply)}
        className="mt-1 h-1.5 w-full overflow-hidden rounded-[1px] bg-line"
      >
        <div
          className={`h-full motion-safe:transition-[width] ${barColor}`}
          style={{ width: `${Math.min(100, Math.round(share * 100))}%` }}
        />
      </div>
    </div>
  );
}
