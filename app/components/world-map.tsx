import { SplashLocation } from "../api/types/referrer-dynamo";
import { MapBackground } from "./icons-and-images/map-background";

const eventStart = new Date("2025-11-12T00:00:00.000Z").toISOString();

const defaultSplashLocation: SplashLocation = {
  city: "Brooklyn",
  region: "New York",
  country: "US",
  lat: 40.699561,
  lon: -73.974303,
  totalScans: 0,
  uniqueIps: 0,
  firstSeenAt: eventStart,
  lastSeenAt: eventStart,
};

const MAP_WIDTH = 939.747;
const MAP_HEIGHT = 476.728;

interface LeaderboardItem {
  label: string;
  value?: string;
}

interface LeaderboardState {
  title: string;
  items: LeaderboardItem[];
}

interface WorldMapProps {
  locations?: SplashLocation[];
  isLoading?: boolean;
  biggestSplash?: LeaderboardState;
  furthestRipple?: LeaderboardState;
}

// Convert lat/lon to SVG coordinates for an equirectangular projection
function latLonToSvg(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * MAP_WIDTH;
  const y = ((90 - lat) / 180) * MAP_HEIGHT;
  return { x, y };
}

// Calculate control point for curved line
function getCurveControlPoint(
  start: { x: number; y: number },
  end: { x: number; y: number }
): { x: number; y: number } {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const offset = Math.abs(end.x - start.x) * 0.3;

  return {
    x: midX,
    y: midY - offset,
  };
}

export function WorldMap({
  locations = [],
  isLoading,
  biggestSplash,
  furthestRipple,
}: WorldMapProps) {
  const defaultPoint = latLonToSvg(
    defaultSplashLocation.lat,
    defaultSplashLocation.lon
  );

  const otherLocations = locations.filter(
    (loc) =>
      loc.lat !== defaultSplashLocation.lat ||
      loc.lon !== defaultSplashLocation.lon
  );

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-sky-900/80 via-sky-950/80 to-slate-950">
      {/* Map SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background world map */}
        <MapBackground />

        {/* Light, subtle graticule */}
        {Array.from({ length: 11 }, (_, i) => {
          const lon = -180 + i * 36;
          const x = ((lon + 180) / 360) * MAP_WIDTH;
          return (
            <line
              key={`lon-${lon}`}
              x1={x}
              y1={0}
              x2={x}
              y2={MAP_HEIGHT}
              stroke="rgba(148, 163, 184, 0.08)"
              strokeWidth={0.5}
            />
          );
        })}

        {Array.from({ length: 7 }, (_, i) => {
          const lat = 90 - i * 30;
          const y = ((90 - lat) / 180) * MAP_HEIGHT;
          return (
            <line
              key={`lat-${lat}`}
              x1={0}
              y1={y}
              x2={MAP_WIDTH}
              y2={y}
              stroke="rgba(148, 163, 184, 0.08)"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Ripple lines from default location */}
        {otherLocations.map((location, index) => {
          const locationPoint = latLonToSvg(location.lat, location.lon);
          const controlPoint = getCurveControlPoint(
            defaultPoint,
            locationPoint
          );
          const opacity = 0.75 - index * 0.1;
          const strokeWidth = 2.5 - index * 0.25;

          return (
            <path
              key={`ripple-${index}-${location.lat}-${location.lon}`}
              d={`M ${defaultPoint.x} ${defaultPoint.y} Q ${controlPoint.x} ${controlPoint.y} ${locationPoint.x} ${locationPoint.y}`}
              stroke="white"
              strokeWidth={Math.max(1, strokeWidth)}
              fill="none"
              opacity={Math.max(0.25, opacity)}
              strokeLinecap="round"
            />
          );
        })}

        {/* Location markers */}
        {otherLocations.map((location, index) => {
          const point = latLonToSvg(location.lat, location.lon);
          return (
            <g key={`marker-${index}-${location.lat}-${location.lon}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={4}
                fill="#60A5FA"
                stroke="white"
                strokeWidth={2}
                opacity={0.95}
              />
            </g>
          );
        })}

        {/* Default splash location marker */}
        <g>
          <circle
            cx={defaultPoint.x}
            cy={defaultPoint.y}
            r={7}
            fill="#FBBF24"
            stroke="white"
            strokeWidth={2}
            opacity={1}
          />
          <circle
            cx={defaultPoint.x}
            cy={defaultPoint.y}
            r={11}
            fill="none"
            stroke="#FBBF24"
            strokeWidth={1}
            opacity={0.7}
          />
        </g>
      </svg>

      {/* Biggest SPLASH – top-left corner */}
      {biggestSplash && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-slate-950/70 backdrop-blur-sm border border-slate-900/70 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-[65%] sm:max-w-xs text-left shadow-lg">
          <h3
            className="text-xs sm:text-sm font-semibold mb-1 text-white"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {biggestSplash.title}
          </h3>
          {isLoading ? (
            <p className="text-[0.7rem] sm:text-xs text-slate-200">
              Loading...
            </p>
          ) : biggestSplash.items.length ? (
            <ul className="space-y-0.5 text-slate-50">
              {biggestSplash.items.map((item, i) => (
                <li
                  key={`${item.label}-${i}`}
                  className="text-[0.7rem] sm:text-xs truncate"
                >
                  {item.label}
                  {item.value ? ` (${item.value})` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.7rem] sm:text-xs text-slate-200">
              No data available
            </p>
          )}
        </div>
      )}

      {/* Furthest Ripple – top-right corner */}
      {furthestRipple && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-slate-950/70 backdrop-blur-sm border border-slate-900/70 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-[65%] sm:max-w-xs text-right shadow-lg">
          <h3
            className="text-xs sm:text-sm font-semibold mb-1 text-white"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            {furthestRipple.title}
          </h3>
          {isLoading ? (
            <p className="text-[0.7rem] sm:text-xs text-slate-200">
              Loading...
            </p>
          ) : furthestRipple.items.length ? (
            <ul className="space-y-0.5 text-slate-50">
              {furthestRipple.items.map((item, i) => (
                <li
                  key={`${item.label}-${i}`}
                  className="text-[0.7rem] sm:text-xs truncate"
                >
                  {item.label}
                  {item.value ? ` (${item.value})` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.7rem] sm:text-xs text-slate-200">
              No data available
            </p>
          )}
        </div>
      )}
    </div>
  );
}
