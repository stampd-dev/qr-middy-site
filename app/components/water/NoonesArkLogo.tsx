// components/water/NoonesArkLogo.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

export function NoonesArkLogo() {
  const [showIndicator, setShowIndicator] = useState(true);

  return (
    <div className="fixed top-4 right-4 z-[100] pointer-events-auto group">
      <a
        href="https://www.noonesark.org"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center h-11 w-11 rounded-full shadow-[0_8px_25px_rgba(15,23,42,0.55)] border border-white/50 backdrop-blur-sm hover:scale-105 active:scale-95 transition-transform transition-colors overflow-hidden pointer-events-auto bg-white/10"
        onMouseEnter={() => setShowIndicator(false)}
        onClick={() => setShowIndicator(false)}
      >
        <Image
          src="/logos/No Ones Ark - Logo.png"
          alt="No One's Ark"
          className="h-full w-full object-contain rounded-full"
          width={44}
          height={44}
        />
      </a>

      {/* Animated Learn More indicator */}
      {showIndicator && (
        <div className="absolute top-full right-0 mt-3 z-[101] pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full animate-pulse">
            <span className="text-[10px] sm:text-xs text-white font-medium whitespace-nowrap">
              Board The Ark
            </span>
            <span className="text-sm sm:text-base text-white animate-bounce">
              ↑
            </span>
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-900/95 text-sky-50 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-[101] border border-sky-500/30 shadow-lg">
        Visit No One&apos;s Ark website
        <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-slate-900/95"></div>
      </div>
    </div>
  );
}
