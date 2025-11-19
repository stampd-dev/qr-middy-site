// components/water/BubbleMenu.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShareModal } from "./ShareModal";
import { NewReferrerForm } from "../new-referrer/NewReferrerForm";
import { CreateNewReferrerResponse } from "../../api/types/create-new-referrer";

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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [newReferrerModalOpen, setNewReferrerModalOpen] = useState(false);
  // Store new referrer data temporarily for share modal
  const [newReferrerData, setNewReferrerData] = useState<{
    code: string;
    shareUrl: string;
    qrCodeDownloadUrl: string;
  } | null>(null);

  // Check for new referrer data in sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("newReferrerData");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Defer state updates to avoid cascading renders
        setTimeout(() => {
          setNewReferrerData(data);
          setShareModalOpen(true);
        }, 0);
        sessionStorage.removeItem("newReferrerData");
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const handleShareClick = () => {
    setOpen(false);
    setShareModalOpen(true);
    onShareThisCode?.();
  };

  const handleGetYourOwnCode = () => {
    setOpen(false);
    setNewReferrerModalOpen(true);
    onGetYourOwnCode?.();
  };

  const handleNewReferrerSuccess = (response: CreateNewReferrerResponse) => {
    // Extract code from response
    const newCode = response.new_referrer.referalCode;

    // Store data for share modal
    const shareData = {
      code: newCode,
      shareUrl: response.referral_link,
      qrCodeDownloadUrl: response.qr_code_download_url,
    };

    // Store in sessionStorage so it persists across navigation
    sessionStorage.setItem("newReferrerData", JSON.stringify(shareData));

    // Close the new referrer modal
    setNewReferrerModalOpen(false);

    // Navigate to the new code
    router.push(`/?ref=${newCode}`);

    // Open share modal with new data
    setNewReferrerData(shareData);
    setShareModalOpen(true);
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
        <BubbleItem
          label="Get your own code"
          icon="🔑"
          onClick={handleGetYourOwnCode}
        />
        <BubbleItem
          label="Share this code"
          icon="🔗"
          onClick={handleShareClick}
        />
        <BubbleItem label="Make a splash!" icon="💦" onClick={onMakeASplash} />
      </div>

      {/* Share Modal */}
      {(shareCode || newReferrerData) && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setNewReferrerData(null);
          }}
          code={newReferrerData?.code || shareCode || ""}
          shareUrl={newReferrerData?.shareUrl || shareUrl}
          qrCodeDownloadUrl={
            newReferrerData?.qrCodeDownloadUrl || qrCodeDownloadUrl
          }
        />
      )}

      {/* New Referrer Modal */}
      {newReferrerModalOpen && (
        <NewReferrerModal
          isOpen={newReferrerModalOpen}
          onClose={() => setNewReferrerModalOpen(false)}
          onSuccess={handleNewReferrerSuccess}
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

type NewReferrerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (response: CreateNewReferrerResponse) => void;
};

function NewReferrerModal({
  isOpen,
  onClose,
  onSuccess,
}: NewReferrerModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="
            relative
            bg-slate-900/95
            border border-sky-500/40
            rounded-3xl
            p-6 sm:p-8
            max-w-md w-full
            shadow-2xl
            backdrop-blur-md
            pointer-events-auto
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="
              absolute top-4 right-4
              w-8 h-8
              flex items-center justify-center
              rounded-full
              bg-slate-800/80
              text-sky-200
              hover:bg-slate-700
              hover:text-sky-100
              transition-colors
            "
            aria-label="Close"
          >
            ✕
          </button>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-sky-50 mb-2">
                Get Your Own Splash Code
              </h2>
              <p className="text-sm text-sky-200/80">
                Fill out the form below to get your own unique splash code.
              </p>
            </div>

            <NewReferrerForm onSuccess={onSuccess} />
          </div>
        </div>
      </div>
    </>
  );
}
