"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// SVG Components
function WaterDroplet() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <path
        d="M48 20C48 20 38 30 38 42C38 54 48 64 48 64C48 64 58 54 58 42C58 30 48 20 48 20Z"
        fill="#93C5FD"
      />
      <ellipse cx="48" cy="72" rx="8" ry="4" fill="#93C5FD" opacity="0.6" />
      <ellipse cx="48" cy="80" rx="12" ry="6" fill="#93C5FD" opacity="0.4" />
      <ellipse cx="48" cy="88" rx="16" ry="8" fill="#93C5FD" opacity="0.2" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block mr-2"
    >
      <path
        d="M5 16L3 10L8 12L12 4L16 12L21 10L19 16H5ZM5 16V20H19V16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
      />
    </svg>
  );
}

function RippleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block mr-2"
    >
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

function WorldMap() {
  return (
    <svg
      width="100%"
      height="256"
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-12"
    >
      {/* Simplified continents */}
      <path
        d="M150 120 Q180 100 200 120 T250 120 Q270 140 250 160 T200 180 Q180 160 150 180 Z"
        fill="#60A5FA"
        opacity="0.3"
        stroke="#93C5FD"
        strokeWidth="2"
      />
      <path
        d="M500 100 Q550 90 600 110 T650 130 Q640 150 600 170 T550 180 Q520 160 500 140 Z"
        fill="#60A5FA"
        opacity="0.3"
        stroke="#93C5FD"
        strokeWidth="2"
      />
      <path
        d="M550 250 Q600 240 650 260 T700 280 Q680 300 650 320 T600 330 Q570 310 550 290 Z"
        fill="#60A5FA"
        opacity="0.3"
        stroke="#93C5FD"
        strokeWidth="2"
      />
      {/* Ripple paths - curved lines from North America to Europe/Africa */}
      <path
        d="M250 150 Q350 100 500 120"
        stroke="white"
        strokeWidth="3"
        fill="none"
        opacity="0.8"
        strokeLinecap="round"
      />
      <path
        d="M250 160 Q400 140 550 250"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
        strokeLinecap="round"
      />
      <path
        d="M250 170 Q380 160 600 280"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LandingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const ref = searchParams.get("ref");

  const getRedirectUrl = (refValue?: string) => {
    const baseUrl = "https://www.noonesark.org/sos";
    const refToUse = refValue || ref;
    if (refToUse) {
      return `${baseUrl}?ref=${encodeURIComponent(refToUse)}`;
    }
    return baseUrl;
  };

  const getKickstarterUrl = () => {
    const baseUrl =
      "https://www.kickstarter.com/projects/noonesark/no-ones-ark-the-most-biblical-campaign-ever";
    const refToUse = ref || "testcode";
    return `${baseUrl}?ref=${encodeURIComponent(refToUse)}`;
  };

  const handleRedirect = (refValue?: string) => {
    setIsFadingOut(true);
    setTimeout(() => {
      router.replace(getRedirectUrl(refValue));
    }, 500);
  };

  const handleKickstarterClick = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      window.location.href = getKickstarterUrl();
    }, 500);
  };

  const handleRippleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // For now, generate a simple ref from name/email
    // In production, this would call an API endpoint
    const generatedRef = `RIPPLE-${name
      .trim()
      .toUpperCase()
      .slice(0, 6)}-${Date.now().toString().slice(-4)}`;

    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: generatedRef }),
    }).catch(() => {
      // Silently fail
    });

    handleRedirect(generatedRef);
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

    // Auto-redirect disabled for testing - uncomment to re-enable
    // const redirectTimer = setTimeout(() => {
    //   handleRedirect();
    // }, 2500);
    // return () => clearTimeout(redirectTimer);
  }, [ref]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <main className="flex-1 flex flex-col items-center px-4 py-8 sm:px-8">
        {/* Header Section */}
        <div className="text-center mt-8 sm:mt-12">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            SPLASH PAGE
          </h1>
          <div className="mb-6">
            <WaterDroplet />
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Welcome to the Ripple CHALLENGE
          </h2>
          <p className="text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto">
            THROUGH THE WAYS OF WATER, LET&apos;S SHOW HOW INTERCONNECTED WE ARE
          </p>
        </div>

        {/* Input Sections */}
        <div className="w-full max-w-4xl mt-12 space-y-8">
          {/* Help Referrer Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="text-white font-medium text-base sm:text-lg whitespace-nowrap">
              RECEIVED A CODE?
            </label>
            <button
              onClick={handleKickstarterClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-8 py-3 transition-colors whitespace-nowrap"
            >
              Proceed to help your referrer and help make a splash!
            </button>
          </div>

          {/* Ripple Input Section */}
          <form
            onSubmit={handleRippleSubmit}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <label className="text-white font-medium text-base sm:text-lg whitespace-nowrap">
              WANT TO START YOUR OWN RIPPLE?
            </label>
            <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="NAME"
                className="bg-blue-400 text-white placeholder:text-blue-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL"
                className="bg-blue-400 text-white placeholder:text-blue-200 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full px-8 py-3 transition-colors whitespace-nowrap"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>

        {/* Leaderboards */}
        <div className="w-full max-w-4xl mt-12 flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center">
          {/* Biggest SPLASH Leaderboard */}
          <div className="text-center">
            <h3
              className="text-2xl sm:text-3xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <CrownIcon />
              Biggest SPLASH
            </h3>
            <ul className="space-y-2 text-white">
              <li className="text-base sm:text-lg">1. PIRATE 111</li>
              <li className="text-base sm:text-lg">2. PIRATE 227</li>
            </ul>
          </div>

          {/* Furthest Ripple Leaderboard */}
          <div className="text-center">
            <h3
              className="text-2xl sm:text-3xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-fredoka)" }}
            >
              <RippleIcon />
              Furthest Ripple
            </h3>
            <ul className="space-y-2 text-white">
              <li className="text-base sm:text-lg">1. PIRATE 111</li>
              <li className="text-base sm:text-lg">2. PIRATE 227</li>
            </ul>
          </div>
        </div>

        {/* World Map */}
        <div className="w-full mt-auto">
          <WorldMap />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-900 via-blue-950 to-blue-950">
          <div className="text-blue-200">Loading...</div>
        </div>
      }
    >
      <LandingPageContent />
    </Suspense>
  );
}
