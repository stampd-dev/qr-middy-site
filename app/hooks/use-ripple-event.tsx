// hooks/useRippleEvents.ts
"use client";
import { useEffect, useState } from "react";
import type {
  FurthestRipple,
  RippleEvent,
  BiggestSplasher,
} from "../components/water/types";

const POLL_INTERVAL_MS = 10_000;

export function useRippleEvents() {
  const [events, setEvents] = useState<RippleEvent[]>([]);
  const [biggestSplashers, setBiggestSplashers] = useState<BiggestSplasher[]>(
    []
  );
  const [furthestRipples, setFurthestRipples] = useState<FurthestRipple[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchTopCodes() {
      try {
        const res = await fetch("/api/get-top-codes");
        if (!res.ok) {
          console.error(
            "[useRippleEvents] Top codes API response not OK:",
            res.status
          );
          return;
        }
        const data = await res.json();

        if (!data.success || cancelled) {
          if (!data.success) {
            console.warn(
              "[useRippleEvents] Top codes API returned success: false",
              data.message
            );
          }
          return;
        }

        const mostArray = Array.isArray(data.most) ? data.most : [];
        const furthestArray = Array.isArray(data.furthest) ? data.furthest : [];

        const biggestSplashers: BiggestSplasher[] = mostArray.map(
          (
            item: { referrer: string; totalUniqueScans: number },
            index: number
          ) => ({
            name: item.referrer || "Unknown",
            totalScans: item.totalUniqueScans || 0,
            rank: index + 1,
          })
        );

        const furthestRipples: FurthestRipple[] = furthestArray
          .sort(
            (
              a: {
                referrer: string;
                location: string;
                distanceFromOriginal: number;
              },
              b: {
                referrer: string;
                location: string;
                distanceFromOriginal: number;
              }
            ) => (b.distanceFromOriginal || 0) - (a.distanceFromOriginal || 0)
          )
          .map(
            (
              item: {
                referrer: string;
                location: string;
                distanceFromOriginal: number;
              },
              index: number
            ) => ({
              name: item.referrer || "Unknown",
              location: item.location || "Unknown",
              rank: index + 1,
            })
          );

        if (!cancelled) {
          setBiggestSplashers(biggestSplashers);
          setFurthestRipples(furthestRipples);
        }
      } catch (error) {
        console.error("[useRippleEvents] Failed to fetch top codes:", error);
      }
    }

    async function fetchRecentRipples() {
      try {
        const res = await fetch("/api/get-recent-ripples");
        if (!res.ok) {
          console.error(
            "[useRippleEvents] Recent ripples API response not OK:",
            res.status
          );
          return;
        }
        const data = await res.json();

        if (!data.success || cancelled) {
          if (!data.success) {
            console.warn(
              "[useRippleEvents] Recent ripples API returned success: false",
              data.message
            );
          }
          return;
        }

        const ripplesArray = Array.isArray(data.ripples) ? data.ripples : [];
        const now = new Date().toISOString();
        const baseTimestamp = Date.now();

        const rippleEvents: RippleEvent[] = ripplesArray.map(
          (
            item: { referrer: string; location: string },
            index: number
          ): RippleEvent => ({
            id: `ripple-${baseTimestamp}-${index}-${item.referrer}-${item.location}`,
            lat: 0, // Placeholder - positions are normalized to fixed slots in geo.ts
            lon: 0, // Placeholder - positions are normalized to fixed slots in geo.ts
            location: item.location || "Unknown",
            referrer: item.referrer || "Unknown",
            firstSeenAt: now,
            lastSeenAt: now,
          })
        );

        if (!cancelled) {
          setEvents(rippleEvents);
        }
      } catch (error) {
        console.error(
          "[useRippleEvents] Failed to fetch recent ripples:",
          error
        );
      }
    }

    async function fetchAll() {
      await Promise.all([fetchTopCodes(), fetchRecentRipples()]);
    }

    fetchAll();
    const id = setInterval(fetchAll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return {
    events,
    biggestSplashers,
    furthestRipples,
    pollIntervalMs: POLL_INTERVAL_MS,
  };
}
