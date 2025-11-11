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

const LABEL_OFFSET_X_PERCENT = -22; // tweak to e.g. -1 or +1
const LABEL_OFFSET_Y_PERCENT = -20; // tweak to move slightly up/down

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

        return (
          <motion.div
            key={label.id}
            className="pointer-events-none absolute"
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
            <div className="rounded-full bg-slate-950/80 px-3 py-1.5 text-center text-[10px] text-sky-100 backdrop-blur">
              <div className="font-semibold text-sky-200">{referrer}</div>
              {location && (
                <div className="text-[9px] text-sky-300">{location}</div>
              )}
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
