"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function LandingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const ref = searchParams.get("ref");

  const getRedirectUrl = () => {
    const baseUrl = "https://www.noonesark.org/sos";
    if (ref) {
      return `${baseUrl}?ref=${encodeURIComponent(ref)}`;
    }
    return baseUrl;
  };

  const handleRedirect = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      router.replace(getRedirectUrl());
    }, 500);
  };

  useEffect(() => {
    // Track the ref in the background (fire-and-forget)
    if (ref) {
      fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref }),
      }).catch(() => {
        // Silently fail - don't block redirect
      });
    }

    // Progress bar animation over 2.5 seconds
    // DISABLED FOR TESTING - uncomment to re-enable auto-redirect
    // const progressInterval = setInterval(() => {
    //   setProgress((prev) => {
    //     if (prev >= 100) {
    //       clearInterval(progressInterval);
    //       return 100;
    //     }
    //     return prev + 2;
    //   });
    // }, 50);

    // Show landing page for 2.5 seconds, then fade out and redirect
    // DISABLED FOR TESTING - uncomment to re-enable auto-redirect
    // const fadeOutTimer = setTimeout(() => {
    //   setIsFadingOut(true);
    // }, 2000);

    // const redirectTimer = setTimeout(() => {
    //   router.replace(getRedirectUrl());
    // }, 2500);

    // return () => {
    //   clearTimeout(fadeOutTimer);
    //   clearTimeout(redirectTimer);
    //   clearInterval(progressInterval);
    // };
  }, [ref, router]);

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <main className="flex min-h-screen w-full flex-col items-center justify-center px-8 py-16 text-center">
        <div className="flex flex-col items-center gap-8 max-w-2xl">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
            Welcome to No One&apos;s Ark
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
            You&apos;re being redirected to our SOS page...
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-md mt-4">
            <div className="h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-600 dark:bg-zinc-400 transition-all duration-75 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Manual redirect button for testing */}
          <button
            onClick={handleRedirect}
            className="mt-8 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Continue to SOS Page
          </button>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
          <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
        </div>
      }
    >
      <LandingPageContent />
    </Suspense>
  );
}
