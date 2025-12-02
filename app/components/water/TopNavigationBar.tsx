// components/water/TopNavigationBar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShareModal } from "./ShareModal";
import { NewReferrerForm } from "../new-referrer/NewReferrerForm";
import { CreateNewReferrerResponse } from "../../api/types/create-new-referrer";
import { OwnerBanner } from "./OwnerBanner";
import { NoonesArkLogo } from "./NoonesArkLogo";
import { RefererStats } from "../../api/types/referrer-dynamo";

type TopNavigationBarProps = {
  shareCode?: string;
  shareUrl?: string;
  qrCodeDownloadUrl?: string;
  hasRefCode?: boolean;
  record?: RefererStats | null | undefined;
  registered?: boolean;
  onGetYourOwnCode?: () => void;
  onShareThisCode?: () => void;
};

type NewReferrerModalProps = {
  isOpen: boolean;
  onSuccess: (response: CreateNewReferrerResponse) => void;
  onContinueWithoutCode: () => void;
};

function NewReferrerModal({
  isOpen,
  onSuccess,
  onContinueWithoutCode,
}: NewReferrerModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
        onClick={onContinueWithoutCode}
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
            onClick={onContinueWithoutCode}
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

            <NewReferrerForm
              onSuccess={onSuccess}
              onContinueWithoutCode={onContinueWithoutCode}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export function TopNavigationBar({
  shareCode,
  shareUrl,
  qrCodeDownloadUrl,
  hasRefCode = true,
  record,
  registered = false,
  onGetYourOwnCode,
  onShareThisCode,
}: TopNavigationBarProps) {
  const router = useRouter();
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

  // Auto-open new referrer form if no ref code
  useEffect(() => {
    if (!hasRefCode && !newReferrerModalOpen) {
      // Small delay to ensure component is mounted
      setTimeout(() => {
        setNewReferrerModalOpen(true);
      }, 100);
    }
  }, [hasRefCode, newReferrerModalOpen]);

  const handleShareClick = () => {
    setShareModalOpen(true);
    onShareThisCode?.();
  };

  const handleGetYourOwnCode = () => {
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

  const handleContinueWithoutCode = () => {
    // Close the new referrer modal
    setNewReferrerModalOpen(false);
    // Navigate to default code
    router.push("/?ref=eef4cb");
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        <div className="flex items-center justify-between gap-2 px-2 sm:px-4 py-2 bg-slate-950/75 backdrop-blur border-b border-sky-500/30 shadow-lg">
          {/* Left: Menu Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-shrink-0">
            <div className="relative group">
              <button
                type="button"
                onClick={handleGetYourOwnCode}
                className="
                  inline-flex items-center justify-center gap-1.5
                  rounded-full
                  bg-white/92
                  text-slate-900 text-xs font-medium
                  px-2.5 sm:px-3 py-1.5
                  min-h-[36px]
                  shadow-[0_4px_12px_rgba(15,23,42,0.35)]
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
                <span className="text-sm">🔑</span>
                <span className="hidden sm:inline">Get Code</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900/95 text-sky-50 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-[101] border border-sky-500/30 shadow-lg">
                Get your own splash code
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95"></div>
              </div>
            </div>
            <div className="relative group">
              <button
                type="button"
                onClick={handleShareClick}
                className="
                  inline-flex items-center justify-center gap-1.5
                  rounded-full
                  bg-white/92
                  text-slate-900 text-xs font-medium
                  px-2.5 sm:px-3 py-1.5
                  min-h-[36px]
                  shadow-[0_4px_12px_rgba(15,23,42,0.35)]
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
                <span className="text-sm">🔗</span>
                <span className="hidden sm:inline">Share</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900/95 text-sky-50 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-[101] border border-sky-500/30 shadow-lg">
                Share this code
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95"></div>
              </div>
            </div>
          </div>

          {/* Center: Owner Banner */}
          <div className="flex-1 flex justify-center min-w-0 pointer-events-auto px-1 sm:px-2">
            <OwnerBanner record={record} registered={registered} />
          </div>

          {/* Right: Logo */}
          <div className="flex items-center pointer-events-auto flex-shrink-0">
            <NoonesArkLogo />
          </div>
        </div>
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
          onSuccess={handleNewReferrerSuccess}
          onContinueWithoutCode={handleContinueWithoutCode}
        />
      )}
    </>
  );
}

