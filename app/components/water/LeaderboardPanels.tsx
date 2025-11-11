// components/water/LeaderboardPanels.tsx
"use client";

type BiggestSplashers = { name: string; totalScans: number; rank: number }[];
type FurthestRipples = { name: string; location: string; rank: number }[];

type LeaderboardPanelsProps = {
  biggestSplashers: BiggestSplashers;
  furthestRipples: FurthestRipples;
};

const MAX_ITEMS = 5;

export function LeaderboardPanels({
  biggestSplashers,
  furthestRipples,
}: LeaderboardPanelsProps) {
  const biggest = [...(biggestSplashers || [])]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, MAX_ITEMS);

  const furthest = [...(furthestRipples || [])]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, MAX_ITEMS);

  if (!biggest.length && !furthest.length) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-between px-4 sm:px-8 lg:px-16">
      {/* Biggest Splashers */}
      {biggest.length > 0 && (
        <div className="max-w-xs rounded-2xl border border-sky-500/30 bg-slate-950/75 px-3 py-2 shadow-xl shadow-sky-900/40 backdrop-blur">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
              Biggest Splashers
            </div>
            <div className="text-[10px] text-sky-200/80">most scans</div>
          </div>
          <div className="space-y-1">
            {biggest.map((item) => (
              <div
                key={`biggest-${item.rank}-${item.name}`}
                className="flex items-center justify-between rounded-lg bg-slate-900/70 px-2 py-1 text-[11px] text-sky-50/95"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-500/30 text-[9px] font-semibold text-sky-100">
                    {item.rank}
                  </span>
                  <span className="truncate max-w-[90px]">{item.name}</span>
                </div>
                <span className="text-[10px] tabular-nums text-sky-300">
                  {item.totalScans.toLocaleString()} scans
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Furthest Ripples */}
      {furthest.length > 0 && (
        <div className="max-w-xs rounded-2xl border border-blue-500/30 bg-slate-950/75 px-3 py-2 shadow-xl shadow-blue-900/40 backdrop-blur ml-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
              Furthest Ripples
            </div>
            <div className="text-[10px] text-sky-200/80">longest journeys</div>
          </div>
          <div className="space-y-1">
            {furthest.map((item) => (
              <div
                key={`furthest-${item.rank}-${item.name}-${item.location}`}
                className="flex items-center justify-between rounded-lg bg-slate-900/70 px-2 py-1 text-[11px] text-sky-50/95"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/30 text-[9px] font-semibold text-sky-100">
                    {item.rank}
                  </span>
                  <span className="truncate max-w-[90px]">{item.name}</span>
                </div>
                <span className="truncate max-w-[90px] text-[10px] text-sky-300">
                  {item.location}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
