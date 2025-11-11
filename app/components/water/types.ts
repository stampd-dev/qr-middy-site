// components/water/types.ts

export type RippleEvent = {
  id: string;

  // Basic location (lat/lon) for positioning on the "water surface"
  lat: number;
  lon: number;

  location: string;
  referrer: string;

  firstSeenAt: string; // ISO string
  lastSeenAt: string; // ISO string
};

export type BiggestSplasher = {
  name: string;
  totalScans: number;
  rank: number;
};
export type FurthestRipple = {
  name: string;
  location: string;
  rank: number;
};
