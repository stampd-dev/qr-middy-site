"use client";

import type { RippleEvent } from "./types";
import { normalizeRippleEvents } from "./geo";
import { AnimatePresence, motion } from "framer-motion";

type SpotlightOverlayProps = {
  events: RippleEvent[];
  highlightId: string | null;
};

export function SpotlightOverlay({
  events,
  highlightId,
}: SpotlightOverlayProps) {
  if (!events.length || !highlightId) return null;

  const normalized = normalizeRippleEvents(events);
  const active = normalized.find((r) => r.id === highlightId);
  if (!active) return null;

  const { referrer, location, x, y } = active;

  return (
    <AnimatePresence>
      <motion.div
        key={active.id}
        className="pointer-events-none absolute max-w-xs rounded-xl border border-sky-500/40 bg-slate-900/80 px-3 py-2 text-[11px] shadow-lg backdrop-blur-md"
        style={{
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          transform: "translate(-50%, -130%)",
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="text-[10px] uppercase tracking-[0.12em] text-sky-300/80">
          Live ripple
        </div>
        <div className="mt-0.5 text-xs font-semibold text-sky-50">
          {referrer}
        </div>
        <div className="text-[11px] text-sky-100/80">{location}</div>
      </motion.div>
    </AnimatePresence>
  );
}
