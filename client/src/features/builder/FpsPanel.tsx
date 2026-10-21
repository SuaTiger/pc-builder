import {
  estimateFps,
  GAMES,
  RESOLUTIONS,
  findGame,
  type Build,
  type FpsBand,
  type FpsEstimate,
  type Resolution,
} from '@pc-builder/shared';
import { useId, useState } from 'react';

const BAND_LABELS: Record<FpsBand, string> = {
  struggles: 'Struggles',
  playable: 'Playable',
  smooth: 'Smooth',
  'high-refresh': 'High refresh rate',
};

const LIMIT_TEXT = {
  gpu: 'Limited by the graphics card.',
  cpu: 'Held back by the processor.',
  game: 'The game limits itself to this.',
} as const;

function Result({ estimate }: { estimate: FpsEstimate }) {
  if (estimate.status === 'needs-gpu') {
    return <p className="text-sm text-muted">Pick a graphics card to estimate frame rate.</p>;
  }
  if (estimate.status === 'no-data') {
    return <p className="text-sm text-muted">No benchmark figures for {estimate.part} yet.</p>;
  }
  return (
    <div>
      <p>
        <span className="title-wide text-3xl font-bold">{estimate.fps}</span>
        <span className="ml-1 text-sm text-muted">fps</span>
        <span className="ml-3 text-sm font-semibold">{BAND_LABELS[estimate.band]}</span>
      </p>
      {estimate.limitedBy && <p className="mt-1 text-sm text-muted">{LIMIT_TEXT[estimate.limitedBy]}</p>}
    </div>
  );
}

/** Estimated frame rate for the chosen graphics card and processor in a game picked here. */
export function FpsPanel({ build }: { build: Build }) {
  const [gameId, setGameId] = useState(GAMES[0]!.id);
  const [resolution, setResolution] = useState<Resolution>('1080p');
  const gameSelectId = useId();

  const game = findGame(gameId) ?? GAMES[0]!;
  const estimate = estimateFps(game, resolution, { cpu: build.cpu, gpu: build.gpu });

  return (
    <section aria-labelledby="fps-title" className="space-y-3">
      <h2 id="fps-title" className="title-wide text-xl font-bold">
        Frame rate
      </h2>

      <div className="space-y-2">
        <label htmlFor={gameSelectId} className="block text-sm text-muted">
          Game
        </label>
        <select
          id={gameSelectId}
          value={gameId}
          onChange={(event) => setGameId(event.target.value)}
          className="w-full rounded-sm border border-line bg-surface px-2 py-1.5 text-sm"
        >
          {GAMES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>

        <fieldset className="flex gap-4 text-sm">
          <legend className="sr-only">Resolution</legend>
          {RESOLUTIONS.map((item) => (
            <label key={item} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="fps-resolution"
                value={item}
                checked={resolution === item}
                onChange={() => setResolution(item)}
                className="accent-trace"
              />
              {item}
            </label>
          ))}
        </fieldset>
      </div>

      <div aria-live="polite">
        <Result estimate={estimate} />
      </div>

      <p className="text-xs text-muted">
        Rough estimate from approximate average benchmarks at {game.settings.toLowerCase()}. Real results vary.
      </p>
    </section>
  );
}
