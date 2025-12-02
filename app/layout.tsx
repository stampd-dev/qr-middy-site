"use client";
// app/layout.tsx (sketch)
import { Suspense, useMemo, useState, useEffect, type ReactNode } from "react";
import "./globals.css";
import { WaterBackground } from "./components/water/WaterBackground";
import { useRippleEvents } from "./hooks/use-ripple-event";
import { RegistrationGate } from "./components/registration/RegistrationGate";
import { useSearchParams } from "next/navigation";
import {
  useReferralLookup,
  useRegisterReferral,
} from "./components/registration/hooks";
import { CentralCallToAction } from "./components/water/CentralCallToAction";
import { TopNavigationBar } from "./components/water/TopNavigationBar";
import { VideoOverlay } from "./components/water/VideoOverlay";

function LayoutContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const rawRefCode = searchParams.get("ref");

  // Initialize video state - show video on first visit
  // For testing: clear sessionStorage to see video again
  const [videoComplete, setVideoComplete] = useState(() => {
    if (typeof window !== "undefined") {
      // Check if video has been seen this session
      const hasSeenVideo = sessionStorage.getItem("hasSeenVideo");
      return hasSeenVideo === "true";
    }
    return false;
  });

  const { loading, error, result } = useReferralLookup(rawRefCode);
  const {
    register,
    isSubmitting,
    error: submitError,
    success,
  } = useRegisterReferral();

  const hasCompleted = useMemo(() => success, [success]);
  const { events, biggestSplashers, furthestRipples } = useRippleEvents();

  // Preload resources while video is playing
  useEffect(() => {
    if (!videoComplete && typeof window !== "undefined") {
      // Preload water texture image
      const waterImage = new Image();
      waterImage.src = "/images/water-texture.jpg";

      // Preload logo
      const logoImage = new Image();
      logoImage.src = "/logos/No Ones Ark - Logo.png";
    }
  }, [videoComplete]);

  const handleVideoComplete = () => {
    setVideoComplete(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasSeenVideo", "true");
    }
  };

  // Get share data from backend response
  // Use rawRefCode as source of truth for registration, fallback to result.code only if no URL code
  const { code, shareUrl, qrCodeDownloadUrl } = useMemo(() => {
    return {
      code: rawRefCode || result?.code || "eef4cb",
      shareUrl: result?.referralLink,
      qrCodeDownloadUrl: result?.qrCodeDownloadUrl,
    };
  }, [rawRefCode, result]);

  return (
    <>
      {/* Video overlay - shows first, before everything else - highest z-index */}
      {!videoComplete && (
        <VideoOverlay
          videoSrc="/videos/No One's Ark - video.mp4"
          onComplete={handleVideoComplete}
        />
      )}

      {/* For testing: Add ?resetVideo=true to URL to see video again */}
      {typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("resetVideo") ===
          "true" && (
          <div className="fixed bottom-4 left-4 z-[10000] bg-blue-500 text-white p-2 rounded text-xs">
            <button
              onClick={() => {
                sessionStorage.removeItem("hasSeenVideo");
                window.location.reload();
              }}
            >
              Reset Video (Click to see video again)
            </button>
          </div>
        )}

      <RegistrationGate
        loading={loading}
        error={error}
        result={result}
        registrationCode={code}
        hasRefCode={!!rawRefCode}
        hasCompleted={hasCompleted}
        register={register}
        isSubmitting={isSubmitting}
        submitError={submitError}
        showVideo={!videoComplete}
      >
        {/* Full-screen water background */}
        <WaterBackground
          events={events}
          biggestSplashers={biggestSplashers}
          furthestRipples={furthestRipples}
        />

        {/* Interactive widgets at root level */}
        <TopNavigationBar
          shareCode={code}
          shareUrl={shareUrl}
          qrCodeDownloadUrl={qrCodeDownloadUrl}
          hasRefCode={!!rawRefCode}
          record={result?.record}
          registered={result?.registered || false}
          onGetYourOwnCode={() => {}}
          onShareThisCode={() => {}}
        />
        <CentralCallToAction
          kickstarterUrl={`https://www.kickstarter.com/projects/noonesark/no-ones-ark-the-most-biblical-campaign-ever?ref=${rawRefCode}`}
        />

        {/* Your normal page content, in the same stack */}
        <div className="relative pointer-events-none">{children}</div>
      </RegistrationGate>
    </>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-slate-950 text-slate-50">
        <Suspense
          fallback={
            <div className="relative pointer-events-none">{children}</div>
          }
        >
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  );
}
