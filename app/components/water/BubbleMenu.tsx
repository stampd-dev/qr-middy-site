// components/water/BubbleMenu.tsx
"use client";

import { useState } from "react";
import { ShareModal } from "./ShareModal";

type PlanetBubbleMenuProps = {
  onGetYourOwnCode?: () => void;
  onShareThisCode?: () => void;
  onMakeASplash?: () => void;
  className?: string;
  shareCode?: string;
  shareUrl?: string;
  qrCodeDownloadUrl?: string;
};

export function PlanetBubbleMenu({
  onGetYourOwnCode,
  onShareThisCode,
  onMakeASplash,
  className = "",
  shareCode,
  shareUrl,
  qrCodeDownloadUrl,
}: PlanetBubbleMenuProps) {
  const [open, setOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleShareClick = () => {
    setOpen(false);
    setShareModalOpen(true);
    onShareThisCode?.();
  };

  return (
    <div
      className={`fixed top-4 left-4 z-[100] pointer-events-auto ${className}`}
    >
      {/* Main bubble toggle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          flex items-center justify-center
          h-11 w-11 rounded-full
          bg-sky-500/90
          text-white text-lg font-semibold
          shadow-[0_8px_25px_rgba(15,23,42,0.55)]
          border border-white/50
          backdrop-blur-sm
          hover:bg-sky-400
          hover:scale-105
          active:scale-95
          transition-transform transition-colors
          cursor-pointer
        "
        aria-label="Open splash menu"
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Bubble list */}
      <div
        className={`
          absolute left-0 mt-3
          flex flex-col gap-2
          ${
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none"
          }
          transition-all duration-200
        `}
      >
        {/* <BubbleItem
          label="Get your own code"
          icon="🔑"
          onClick={onGetYourOwnCode}
        /> */}
        <BubbleItem
          label="Share this code"
          icon="🔗"
          onClick={handleShareClick}
        />
        <BubbleItem label="Make a splash!" icon="💦" onClick={onMakeASplash} />
      </div>

      {/* Share Modal */}
      {shareCode && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          code={shareCode}
          shareUrl={shareUrl}
          qrCodeDownloadUrl={qrCodeDownloadUrl}
        />
      )}
    </div>
  );
}

type BubbleItemProps = {
  label: string;
  icon: string;
  onClick?: () => void;
};

function BubbleItem({ label, icon, onClick }: BubbleItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex items-center gap-2
        rounded-full
        bg-white/92
        text-slate-900 text-xs font-medium
        px-4 py-2
        shadow-[0_6px_20px_rgba(15,23,42,0.45)]
        border border-sky-100/80
        backdrop-blur-md
        whitespace-nowrap
        hover:bg-sky-50
        hover:-translate-y-0.5
        active:translate-y-0
        transition-transform transition-colors
        cursor-pointer
      "
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
