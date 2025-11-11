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

    async function fetchEvents() {
      try {
        // const res = await fetch("/api/ripples"); // your endpoint
        // if (!res.ok) return;
        // const data: RippleEvent[] = await res.json();
        const data: RippleEvent[] = [
          {
            id: "1",
            lat: 51.5074,
            lon: -0.1278,
            location: "London",
            referrer: "Scott",
            firstSeenAt: "2025-11-11T12:00:00.000Z",
            lastSeenAt: "2025-11-11T12:00:00.000Z",
          },
          {
            id: "2",
            lat: 30.2672,
            lon: -97.7431,
            location: "TX",
            referrer: "Joe",
            firstSeenAt: "2025-11-11T12:00:00.000Z",
            lastSeenAt: "2025-11-11T12:00:00.000Z",
          },
          {
            id: "3",
            lat: 40.7128,
            lon: -74.006,
            location: "NY",
            referrer: "Sean",
            firstSeenAt: "2025-11-11T12:00:00.000Z",
            lastSeenAt: "2025-11-11T12:00:00.000Z",
          },
          {
            id: "4",
            lat: 37.7749,
            lon: -122.4194,
            location: "CA",
            referrer: "Alex",
            firstSeenAt: "2025-11-11T12:00:00.000Z",
            lastSeenAt: "2025-11-11T12:00:00.000Z",
          },
          {
            id: "5",
            lat: 34.0522,
            lon: -118.2437,
            location: "CA",
            referrer: "Chris",
            firstSeenAt: "2025-11-11T12:00:00.000Z",
            lastSeenAt: "2025-11-11T12:00:00.000Z",
          },
        ];

        const biggestSplashers = [
          { name: "Scott", totalScans: 1, rank: 1 },
          { name: "Joe", totalScans: 1, rank: 2 },
          { name: "Sean", totalScans: 1, rank: 3 },
          { name: "Alex", totalScans: 1, rank: 4 },
          { name: "Chris", totalScans: 1, rank: 5 },
        ];

        const furthestRipples = [
          { name: "Scott", location: "London", rank: 1 },
          { name: "Joe", location: "TX", rank: 2 },
          { name: "Sean", location: "NY", rank: 3 },
          { name: "Alex", location: "CA", rank: 4 },
          { name: "Chris", location: "CA", rank: 5 },
        ];

        if (!cancelled) {
          setEvents(data);
          setBiggestSplashers(biggestSplashers);
          setFurthestRipples(furthestRipples);
        }
      } catch {
        // swallow errors or log
      }
    }

    fetchEvents();
    const id = setInterval(fetchEvents, POLL_INTERVAL_MS);

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
