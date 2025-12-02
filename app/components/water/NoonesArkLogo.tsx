// components/water/NoonesArkLogo.tsx
"use client";

import Image from "next/image";

export function NoonesArkLogo() {
  return (
    <div className="relative group">
      <a
        href="https://www.noonesark.org"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center pointer-events-auto transition-opacity hover:opacity-100 opacity-90"
      >
        <Image
          src="/logos/No Ones Ark - Logo.png"
          alt="No One's Ark"
          width={120}
          height={40}
          className="h-8 w-auto object-contain"
          priority
        />
      </a>
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-900/95 text-sky-50 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-[101] border border-sky-500/30 shadow-lg">
        Visit No One's Ark website
        <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-slate-900/95"></div>
      </div>
    </div>
  );
}

