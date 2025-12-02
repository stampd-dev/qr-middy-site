"use client";

import { useMemo } from "react";
import { RefererStats } from "../../api/types/referrer-dynamo";

type OwnerBannerProps = {
  record: RefererStats | null | undefined;
  registered: boolean;
  className?: string;
};

// Default NYC location (40.7128° N, 74.0060° W)
const NYC_LAT = 40.7128;
const NYC_LON = -74.006;

// Haversine formula to calculate distance between two points in kilometers
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function OwnerBanner({
  record,
  registered,
  className = "",
}: OwnerBannerProps) {
  // Calculate furthest scan distance from NYC
  const furthestDistance = useMemo(() => {
    if (!record?.splashLocations?.length) return null;

    let maxDistance = 0;
    let furthestLocation = null;

    for (const location of record.splashLocations) {
      const distance = calculateDistance(
        NYC_LAT,
        NYC_LON,
        location.lat,
        location.lon
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        furthestLocation = location;
      }
    }

    return {
      distance: maxDistance,
      location: furthestLocation,
    };
  }, [record]);

  // Don't render if no record or not registered
  if (!record || !registered) {
    return null;
  }

  const ownerName =
    record.referrerName ||
    `${record.firstName || ""} ${record.lastName || ""}`.trim() ||
    "Unknown Owner";

  const totalScans = record.totalScans || 0;
  const uniqueScans = record.uniqueScans || 0;

  return (
    <div
      className={`rounded-lg border border-sky-500/30 bg-slate-950/75 px-2.5 py-1.5 shadow-lg shadow-sky-900/40 backdrop-blur ${className}`}
    >
      <div className="flex items-center gap-x-2.5 text-[10px] sm:text-[11px] flex-wrap">
        {/* Owner Name */}
        <span className="font-semibold text-sky-50/95 truncate max-w-[120px] sm:max-w-[150px]">
          {`Ripples by ${ownerName}`}
        </span>

        <div className="w-px h-3 bg-sky-500/30" />

        {/* Total Scans */}
        <div className="flex items-center gap-1">
          <span className="text-sky-200/70">Total:</span>
          <span className="font-semibold tabular-nums text-sky-300">
            {totalScans.toLocaleString()}
          </span>
        </div>

        <div className="w-px h-3 bg-sky-500/30" />

        {/* Unique Scans */}
        <div className="flex items-center gap-1">
          <span className="text-sky-200/70">Unique:</span>
          <span className="font-semibold tabular-nums text-sky-300">
            {uniqueScans.toLocaleString()}
          </span>
        </div>

        {/* Furthest Scan */}
        {furthestDistance && (
          <>
            <div className="w-px h-3 bg-sky-500/30" />
            <div className="flex items-center gap-1">
              <span className="text-sky-200/70">Furthest:</span>
              <span className="font-semibold tabular-nums text-sky-300">
                {furthestDistance.distance.toFixed(0)} km
              </span>
              {furthestDistance.location?.city && (
                <span className="text-sky-400/60 text-[9px] truncate max-w-[60px] sm:max-w-[80px]">
                  ({furthestDistance.location.city})
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
