import type { Build, CompatibilityReport, PartCategory } from '@pc-builder/shared';
import type { ReactNode } from 'react';
import { slotStatus, type SlotStatus } from './build-state';

/*
 * A flat sketch of the inside of the case. Each part has a fixed place; empty places are dashed
 * outlines. A part that is picked slides in from the side it would be fitted from, and one that is
 * replaced slides in again because its key (the part id) changes. Colour follows the slot's status,
 * the same as the pins in the slot list.
 */

const fillByStatus: Record<SlotStatus, string> = {
  empty: 'fill-line',
  ok: 'fill-trace',
  warning: 'fill-caution',
  error: 'fill-fault',
};

type Direction = 'left' | 'right' | 'top' | 'bottom';

interface SlotProps {
  /** Present when a part is in the slot; its id restarts the animation when the part changes. */
  partId?: string;
  from: Direction;
  status: SlotStatus;
  children: ReactNode;
  /** Shapes drawn when the slot is empty. */
  outline: ReactNode;
}

function Slot({ partId, from, status, children, outline }: SlotProps) {
  if (!partId) return <g aria-hidden="true" className="fill-none stroke-line" strokeDasharray="4 3">{outline}</g>;
  return (
    <g key={partId} className={`seat seat-from-${from} ${fillByStatus[status]}`}>
      {children}
    </g>
  );
}

export function BuildDiagram({ build, report }: { build: Build; report: CompatibilityReport }) {
  const status = (category: PartCategory) => slotStatus(build, category, report);
  const drives = build.storage ?? [];

  const mobo = <rect x="24" y="24" width="176" height="176" rx="3" />;
  const psu = <rect x="24" y="208" width="120" height="32" rx="3" />;
  const cpu = <rect x="72" y="60" width="36" height="36" rx="2" />;
  const cooler = <circle cx="90" cy="78" r="27" />;
  const gpu = <rect x="36" y="136" width="150" height="24" rx="2" />;
  const ram = (
    <>
      <rect x="132" y="40" width="8" height="76" rx="1" />
      <rect x="146" y="40" width="8" height="76" rx="1" />
    </>
  );

  return (
    <svg
      viewBox="0 0 320 260"
      role="img"
      aria-label="Sketch of the parts picked so far, fitted inside the case"
      className="w-full max-w-sm"
    >
      <rect x="8" y="8" width="304" height="244" rx="6" className={build.case ? 'fill-none stroke-trace' : 'fill-none stroke-line'} strokeWidth="2" />

      <Slot partId={build.motherboard?.id} from="left" status={status('motherboard')} outline={mobo}>
        <g fillOpacity="0.14">{mobo}</g>
        <g className="fill-none stroke-current" strokeOpacity="0.6">{mobo}</g>
      </Slot>

      <Slot partId={build.psu?.id} from="left" status={status('psu')} outline={psu}>
        <g fillOpacity="0.5">{psu}</g>
      </Slot>

      <Slot partId={build.cpu?.id} from="top" status={status('cpu')} outline={cpu}>
        {cpu}
      </Slot>

      <Slot partId={build.cooler?.id} from="top" status={status('cooler')} outline={cooler}>
        <g fillOpacity="0.28">{cooler}</g>
      </Slot>

      <Slot partId={build.ram?.id} from="top" status={status('ram')} outline={ram}>
        {ram}
      </Slot>

      <Slot partId={build.gpu?.id} from="right" status={status('gpu')} outline={gpu}>
        {gpu}
      </Slot>

      {[0, 1, 2, 3].map((index) => {
        const drive = drives[index];
        const box = <rect x="218" y={28 + index * 34} width="76" height="26" rx="2" />;
        return (
          <Slot key={index} partId={drive?.id && `${drive.id}-${index}`} from="right" status={status('storage')} outline={box}>
            {box}
          </Slot>
        );
      })}
    </svg>
  );
}
