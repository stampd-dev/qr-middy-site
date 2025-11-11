// components/water/geo.ts

import type { RippleEvent } from "./types";

export type NormalizedRipple = RippleEvent & {
  x: number; // 0–1
  y: number; // 0–1
  index: number; // 0..N-1
};

/**
 * Predefined positions for ripples, chosen so they avoid the
 * central CTA card. Think:
 * - top center
 * - left column (upper + mid)
 * - right column (upper + mid)
 *
 * Adjust these numbers if you tweak CTA size/position.
 */
const RIPPLE_SLOTS: { x: number; y: number }[] = [
  // above CTA
  { x: 0.5, y: 0.18 },

  // left of CTA
  { x: 0.1, y: 0.3 },
  { x: 0.1, y: 0.55 },

  // right of CTA
  { x: 0.9, y: 0.3 },
  { x: 0.9, y: 0.55 },
];

/**
 * Map each event to one of the allowed ripple slots.
 * If there are more events than slots, we loop back around.
 */
export function normalizeRippleEvents(
  events: RippleEvent[]
): NormalizedRipple[] {
  if (!events.length) return [];

  const totalSlots = RIPPLE_SLOTS.length;

  return events.map((event, index) => {
    const slot = RIPPLE_SLOTS[index % totalSlots];

    return {
      ...event,
      x: slot.x,
      y: slot.y,
      index,
    };
  });
}
