// src/qr-metrics/types.ts

export interface ScreenInfo {
  width: number | null;
  height: number | null;
  pixelRatio: number | null;
}

export interface UserHints {
  email: string | null;
  name: string | null;
  phone: string | null;
}

/**
 * This is the exact shape sent from FE -> BE when a QR is scanned.
 * The backend then:
 * - attaches ip / ipInfo
 * - handles unique vs repeat logic
 * - increments per-QR and per-device counters
 */
export interface QrMetricsUpdateInput {
  // What was scanned / which short link
  qrId: string | null;

  // Device-level identity & fingerprinting
  deviceId: string | null;
  sessionId: string | null;
  fingerprint: string | null;

  // Environment / context
  userAgent: string | null;
  language: string | null;
  timezone: string | null;
  screen: ScreenInfo;

  // Traffic context
  referrer: string | null;
  url: string | null;

  // Best-effort hints from first-party cookies
  userHints: UserHints;
}
