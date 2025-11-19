// components/water/CentralCallToAction.tsx
"use client";

import { motion } from "framer-motion";

type CentralCallToActionProps = {
  kickstarterUrl: string;
};

export function CentralCallToAction({
  kickstarterUrl,
}: CentralCallToActionProps) {
  return (
    <motion.div
      className="pointer-events-auto fixed left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-3xl border border-sky-400/40 bg-slate-950/75 px-6 py-5 text-center text-sky-50 shadow-2xl shadow-sky-900/50 backdrop-blur-md max-w-sm sm:max-w-md"
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300 mb-2">
        Make a Splash
      </div>

      <h2 className="text-md sm:text-2xl font-semibold leading-tight mb-2 text-sky-50">
        Turn your ripple into waves
      </h2>

      <motion.a
        href={kickstarterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full bg-sky-400 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          /** push to external kickstarter url with ref code attached */
          window.location.href = kickstarterUrl;
        }}
      >
        DONATE NOW{" "}
      </motion.a>
    </motion.div>
  );
}
