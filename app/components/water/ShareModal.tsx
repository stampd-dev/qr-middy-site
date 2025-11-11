// components/water/ShareModal.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  shareUrl?: string;
  qrCodeDownloadUrl?: string;
};

export function ShareModal({
  isOpen,
  onClose,
  code,
  shareUrl: providedShareUrl,
  qrCodeDownloadUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Use provided share URL or build fallback on client side
  const shareUrl = useMemo(() => {
    if (providedShareUrl) {
      return providedShareUrl;
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}/?ref=${code}`;
    }
    return "";
  }, [providedShareUrl, code]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeDownloadUrl) {
      // Download from S3 URL
      const link = document.createElement("a");
      link.href = qrCodeDownloadUrl;
      link.download = `qr-code-${code}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Fallback: generate from SVG if no S3 URL provided
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `qr-code-${code}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        });
      }
    };

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
  };

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
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-sky-50 mb-2">
                Share Your Splash Code
              </h2>
              <p className="text-sm text-sky-200/80">
                Share code{" "}
                <span className="font-semibold text-sky-300">{code}</span> with
                others
              </p>
            </div>

            {/* QR Code */}
            {shareUrl && (
              <div
                ref={qrRef}
                className="
                  p-4
                  bg-white
                  rounded-2xl
                  shadow-lg
                  flex items-center justify-center
                "
              >
                {qrCodeDownloadUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeDownloadUrl}
                    alt={`QR code for ${code}`}
                    className="w-[200px] h-[200px] object-contain"
                  />
                ) : (
                  <QRCodeSVG
                    value={shareUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                )}
              </div>
            )}

            {/* Share URL */}
            <div className="w-full space-y-2">
              <label className="block text-xs font-semibold text-sky-300 uppercase tracking-wide mb-1">
                Share URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="
                    flex-1
                    px-3 py-2
                    rounded-xl
                    bg-slate-800/80
                    border border-slate-600
                    text-sm text-sky-50
                    focus:outline-none focus:ring-2 focus:ring-sky-400/50
                  "
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  disabled={!shareUrl}
                  className="
                    px-4 py-2
                    rounded-xl
                    bg-sky-500
                    text-white text-sm font-semibold
                    hover:bg-sky-400
                    active:scale-95
                    transition-colors transition-transform
                    whitespace-nowrap
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Download QR button */}
            <button
              type="button"
              onClick={handleDownloadQR}
              disabled={!shareUrl}
              className="
                w-full
                px-4 py-3
                rounded-xl
                bg-sky-400/90
                text-slate-950 text-sm font-semibold
                hover:bg-sky-300
                active:scale-95
                transition-colors transition-transform
                flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <span>⬇</span>
              <span>Download QR Code</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
