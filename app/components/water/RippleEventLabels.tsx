// components/water/RippleEventLabels.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { NormalizedRipple } from "./geo";

export type ActiveLabel = {
  id: string;
  index: number;
  startedAt: number;
};

type RippleEventLabelsProps = {
  events: NormalizedRipple[];
  activeLabels: ActiveLabel[];
};

const LABEL_OFFSET_X_PERCENT = -35; // tweak to e.g. -1 or +1
const LABEL_OFFSET_Y_PERCENT = -30; // tweak to move slightly up/down

// Fixed size for circular labels - sized to fit 12 chars per line (name + location)
const LABEL_SIZE = 70; // pixels

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

export function RippleEventLabels({
  events,
  activeLabels,
}: RippleEventLabelsProps) {
  if (!events.length || !activeLabels.length) return null;

  return (
    <AnimatePresence>
      {activeLabels.map((label) => {
        const event = events[label.index];
        if (!event) return null;

        const { x, y, referrer, location } = event;
        if (!referrer && !location) return null;

        const truncatedReferrer = truncateText(referrer, 12);
        const truncatedLocation = location ? truncateText(location, 12) : null;

        return (
          <motion.div
            key={label.id}
            className="pointer-events-none absolute flex items-center justify-center"
            style={{
              left: `calc(${x * 100}% + ${LABEL_OFFSET_X_PERCENT}px)`,
              top: `calc(${y * 100}% + ${LABEL_OFFSET_Y_PERCENT}px)`,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div
              className="flex flex-col items-center justify-center rounded-full bg-slate-950/80 text-center text-[10px] text-sky-100 backdrop-blur"
              style={{
                width: `${LABEL_SIZE}px`,
                height: `${LABEL_SIZE}px`,
              }}
            >
              <div className="font-semibold text-sky-200 leading-tight">
                {truncatedReferrer}
              </div>
              {truncatedLocation && (
                <div className="text-[9px] text-sky-300 leading-tight mt-0.5">
                  {truncatedLocation}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
