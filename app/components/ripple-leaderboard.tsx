"use client";

import React from "react";

type BiggestSplasher = {
  name: string;
  totalScans: number;
};

type FurthestRipple = {
  name: string;
  location: string;
};

type TickerItem = {
  type: "BIGGEST" | "BIG" | "FURTHEST" | "FAR";
  label: string;
  detail: string;
};

interface LiveRipplesTickerProps {
  biggestSplashers: BiggestSplasher[];
  furthestRipples: FurthestRipple[];
}

export function LiveRipplesTicker({
  biggestSplashers,
  furthestRipples,
}: LiveRipplesTickerProps) {
  const tickerItems: TickerItem[] = [
    ...biggestSplashers.map((entry, idx) => ({
      type: idx === 0 ? ("BIGGEST" as const) : ("BIG" as const),
      label: entry.name,
      detail: `${entry.totalScans} scans`,
    })),
    ...furthestRipples.map((entry, idx) => ({
      type: idx === 0 ? ("FURTHEST" as const) : ("FAR" as const),
      label: entry.name,
      detail: entry.location,
    })),
  ];

  if (tickerItems.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-x-0 top-2 sm:top-3 z-20 px-3 sm:px-4 pointer-events-none">
      <div className="pointer-events-auto w-full flex justify-center">
        <div className="w-full max-w-3xl rounded-full border border-sky-500/40 bg-slate-950/80 shadow-md overflow-hidden">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2">
            {/* Static label on the left */}
            <span className="text-[0.6rem] sm:text-xs font-semibold uppercase tracking-wide text-sky-300 flex-shrink-0">
              Leaders
            </span>

            <span className="h-4 w-px bg-slate-700/80 flex-shrink-0" />

            {/* Scrolling track */}
            <div className="relative flex-1 overflow-hidden">
              <div className="flex gap-4 sm:gap-6 ticker-track">
                {/* first copy */}
                {tickerItems.map((item, idx) => (
                  <TickerChip key={`ticker-1-${idx}`} item={item} />
                ))}
                {/* second copy */}
                {tickerItems.map((item, idx) => (
                  <TickerChip key={`ticker-2-${idx}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TickerChip({ item }: { item: TickerItem }) {
  const isBiggest = item.type === "BIGGEST";

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 text-[0.65rem] sm:text-xs text-slate-100 flex-shrink-0">
      <span
        className={`inline-flex h-2 w-2 rounded-full ${
          isBiggest ? "bg-sky-400" : "bg-emerald-400"
        }`}
      />
      <span
        className={`font-semibold uppercase ${
          isBiggest ? "text-sky-200" : "text-emerald-200"
        }`}
      >
        {isBiggest ? "Biggest" : "Furthest"}
      </span>
      <span className="text-slate-100 truncate max-w-[9rem] sm:max-w-[11rem]">
        {item.label}
        <span
          className={`${isBiggest ? "text-sky-300" : "text-emerald-300"} ml-1`}
        >
          ({item.detail})
        </span>
      </span>
    </div>
  );
}
