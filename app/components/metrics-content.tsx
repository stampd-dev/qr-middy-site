"use client";

import React from "react";
import { RippleOverlay } from "./ripple-overlay";
import { WaterBackground } from "./ripple-background";
import { LiveRipplesTicker } from "./ripple-leaderboard";
import { RegisterCodeView } from "./views/register-code-view";

export function MainContent({
  registered,
  ref,
  setRegistered,
}: {
  registered: boolean;
  ref: string;
  setRegistered: (registered: boolean) => void;
}) {
  const biggestSplashers = [
    { name: "Referrer A", totalScans: 42 },
    { name: "Referrer B", totalScans: 31 },
    { name: "Referrer C", totalScans: 24 },
  ];

  const furthestRipples = [
    { name: "Referrer D", location: "Tokyo, JP" },
    { name: "Referrer E", location: "London, UK" },
    { name: "Referrer F", location: "Cape Town, ZA" },
  ];

  const handleKickstarterClick = () => {
    const baseUrl =
      "https://www.kickstarter.com/projects/noonesark/no-ones-ark-the-most-biblical-campaign-ever";
    const kickstarterUrl = `${baseUrl}?ref=${encodeURIComponent("eef4cb")}`;
    window.open(kickstarterUrl, "_blank");
  };

  const handleCreateRipplesClick = () => {
    setRegistered(false);
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden">
      {/* Layer 1: Water background */}
      <div className="absolute inset-0 z-0">
        <WaterBackground />
      </div>

      {/* Layer 2: Ripple overlay (behind CTAs, non-interactive) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <RippleOverlay
          ripples={[
            { name: "Alice", location: "Austin, TX" },
            { name: "Ben", location: "Brooklyn, NY" },
            { name: "Chloe", location: "Paris, FR" },
            { name: "Diego", location: "São Paulo, BR" },
            { name: "Ethan", location: "London, UK" },
            { name: "Fiona", location: "Tokyo, JP" },
            { name: "George", location: "Sydney, AU" },
            { name: "Hannah", location: "Cape Town, ZA" },
            { name: "Isaac", location: "Dubai, AE" },
            { name: "Julia", location: "Moscow, RU" },
          ]}
        />
      </div>
      {!registered ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full flex justify-center px-3 sm:px-4">
            <RegisterCodeView code={ref} setRegistered={setRegistered} />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full flex justify-center px-3 sm:px-4">
            <div className="w-full max-w-[60%] sm:max-w-md bg-slate-950/55 border border-sky-500/30 rounded-2xl px-3 sm:px-4 py-3 sm:py-4 shadow-lg shadow-sky-900/40 backdrop-blur-md text-center">
              <p className="text-[0.65rem] sm:text-xs text-sky-200/90 uppercase tracking-[0.18em] mb-1">
                Ripple Challenge
              </p>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-50 mb-3">
                Choose your ripple.
              </h1>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {/* Primary CTA */}
                <button
                  onClick={handleKickstarterClick}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-sky-500/90 hover:bg-sky-400 active:bg-sky-600 text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 px-3 shadow-md shadow-sky-500/40 transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                >
                  Make a Splash
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={handleCreateRipplesClick}
                  className="flex-1 inline-flex items-center justify-center rounded-full border border-sky-400/60 bg-slate-900/40 hover:bg-slate-900/70 text-sky-100 text-xs sm:text-sm font-medium py-2 sm:py-2.5 px-3 shadow-sm transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
                >
                  Create Your Own Ripples
                </button>
              </div>

              <p className="mt-2 text-[0.6rem] sm:text-[0.7rem] text-slate-400">
                One tap to join the wave or start your own.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Layer 3: Slim, semi-transparent CTAs (above ripples) */}

      {/* Layer 4: Auto-scrolling ticker on top */}
      <LiveRipplesTicker
        biggestSplashers={biggestSplashers}
        furthestRipples={furthestRipples}
      />
    </div>
  );
}
