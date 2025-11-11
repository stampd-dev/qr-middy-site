"use client";
// app/layout.tsx (sketch)
import { Suspense, useMemo, type ReactNode } from "react";
import "./globals.css";
import { WaterBackground } from "./components/water/WaterBackground";
import { useRippleEvents } from "./hooks/use-ripple-event";
import { RegistrationGate } from "./components/registration/RegistrationGate";
import { useSearchParams } from "next/navigation";
import {
  useReferralLookup,
  useRegisterReferral,
} from "./components/registration/hooks";
import dynamic from "next/dynamic";
import { CentralCallToAction } from "./components/water/CentralCallToAction";

const PlanetBubbleMenu = dynamic(
  () => import("./components/water/BubbleMenu").then((m) => m.PlanetBubbleMenu),
  {
    ssr: false,
  }
);

function LayoutContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const rawRefCode = searchParams.get("ref");

  const { loading, error, result } = useReferralLookup(rawRefCode);
  const {
    register,
    isSubmitting,
    error: submitError,
    success,
  } = useRegisterReferral();

  const hasCompleted = useMemo(() => success, [success]);
  const { events, biggestSplashers, furthestRipples } = useRippleEvents();

  // Get share data from backend response
  // Use rawRefCode as source of truth for registration, fallback to result.code only if no URL code
  const registrationCode = rawRefCode || result?.code || "eef4cb";
  const shareCode = result?.code || rawRefCode || "eef4cb";
  const shareUrl = result?.referralLink;
  const qrCodeDownloadUrl = result?.qrCodeDownloadUrl;

  return (
    <RegistrationGate
      loading={loading}
      error={error}
      result={result}
      registrationCode={registrationCode}
      hasCompleted={hasCompleted}
      register={register}
      isSubmitting={isSubmitting}
      submitError={submitError}
    >
      {/* Full-screen water background */}
      <WaterBackground
        events={events}
        biggestSplashers={biggestSplashers}
        furthestRipples={furthestRipples}
      />

      {/* Interactive widgets at root level */}
      <PlanetBubbleMenu
        onGetYourOwnCode={() => {}}
        onShareThisCode={() => {}}
        onMakeASplash={() => {
          /** push to external kickstarter url with ref code attached */
          window.location.href = `https://www.kickstarter.com/projects/noonesark/no-ones-ark-the-most-biblical-campaign-ever?ref=${rawRefCode}`;
        }}
        shareCode={shareCode}
        shareUrl={shareUrl}
        qrCodeDownloadUrl={qrCodeDownloadUrl}
      />
      <CentralCallToAction
        kickstarterUrl={`https://www.kickstarter.com/projects/noonesark/no-ones-ark-the-most-biblical-campaign-ever?ref=${rawRefCode}`}
      />

      {/* Your normal page content, in the same stack */}
      <div className="relative pointer-events-none">{children}</div>
    </RegistrationGate>
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
