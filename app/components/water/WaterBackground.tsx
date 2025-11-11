// components/water/WaterBackground.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

import type { RippleEvent } from "./types";
import { normalizeRippleEvents, type NormalizedRipple } from "./geo";
import { LeaderboardPanels } from "./LeaderboardPanels";
import { RippleEventLabels, type ActiveLabel } from "./RippleEventLabels";

type WaterWaveMethods = {
  drop?: (opts: {
    x: number;
    y: number;
    radius: number;
    strength: number;
  }) => void;
};

// Dynamically load react-water-wave on the client only
const WaterWave = dynamic(() => import("react-water-wave"), {
  ssr: false,
}) as React.ComponentType<{
  imageUrl: string;
  style?: React.CSSProperties;
  dropRadius?: number;
  perturbance?: number;
  resolution?: number;
  interactive?: boolean;
  children: (methods: WaterWaveMethods) => React.ReactNode;
}>;

type BiggestSplashers = { name: string; totalScans: number; rank: number }[];
type FurthestRipples = { name: string; location: string; rank: number }[];

type WaterBackgroundProps = {
  /** Ripple events (e.g. 5 latest), in the order you want them triggered */
  events: RippleEvent[];

  /** Leaderboard data for the panels */
  biggestSplashers: BiggestSplashers;
  furthestRipples: FurthestRipples;
};

// one new event every 2s
const TRIGGER_INTERVAL_MS = 2000;

// labels live ~4s so they overlap a bit
const LABEL_DURATION_MS = 4000;

export function WaterBackground({
  events,
  biggestSplashers,
  furthestRipples,
}: WaterBackgroundProps) {
  const [activeLabels, setActiveLabels] = useState<ActiveLabel[]>([]);

  // reference to water-wave's manual drop method
  const dropRef = useRef<
    | null
    | ((opts: {
        x: number;
        y: number;
        radius: number;
        strength: number;
      }) => void)
  >(null);

  const indexRef = useRef<number>(-1);

  // shared container for both drop() and label positioning
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fixed canvas positions for each event index
  const normalizedEvents: NormalizedRipple[] = useMemo(
    () => normalizeRippleEvents(events),
    [events]
  );

  useEffect(() => {
    indexRef.current = -1;

    const intervalId = setInterval(() => {
      const total = normalizedEvents.length;
      if (!total) {
        setActiveLabels([]);
        return;
      }

      indexRef.current = (indexRef.current + 1) % total;
      const evt = normalizedEvents[indexRef.current];

      // compute pixels based on the same container we use for labels
      if (dropRef.current && typeof window !== "undefined") {
        const el = containerRef.current;
        let width = window.innerWidth;
        let height = window.innerHeight;

        if (el) {
          const rect = el.getBoundingClientRect();
          width = rect.width;
          height = rect.height;
        }

        const xPx = evt.x * width;
        const yPx = evt.y * height;

        dropRef.current({
          x: xPx,
          y: yPx,
          radius: 30,
          strength: 0.045,
        });
      }

      setActiveLabels((prev) => {
        const now = Date.now();
        const stillAlive = prev.filter(
          (label) => now - label.startedAt < LABEL_DURATION_MS
        );

        const nextLabel: ActiveLabel = {
          id: `${evt.id}-${now}`,
          index: evt.index,
          startedAt: now,
        };

        return [...stillAlive, nextLabel];
      });
    }, TRIGGER_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [normalizedEvents.length, normalizedEvents]);

  return (
    <div className="fixed inset-0 -z-0 overflow-hidden">
      <WaterWave
        imageUrl="/images/water-texture.jpg"
        style={{ width: "100%", height: "100%" }}
        dropRadius={15}
        perturbance={0.02}
        resolution={512}
        interactive={false}
      >
        {(methods: WaterWaveMethods) => {
          // Capture drop method from react-water-wave
          dropRef.current =
            typeof methods?.drop === "function" ? methods.drop : null;

          return (
            <div
              ref={containerRef}
              className="relative h-full w-full pointer-events-none"
            >
              {/* Labels for currently active RippleEvents (can overlap) */}
              <RippleEventLabels
                events={normalizedEvents}
                activeLabels={activeLabels}
              />

              {/* Leaderboard panels at the bottom */}
              <LeaderboardPanels
                biggestSplashers={biggestSplashers}
                furthestRipples={furthestRipples}
              />
            </div>
          );
        }}
      </WaterWave>
    </div>
  );
}
