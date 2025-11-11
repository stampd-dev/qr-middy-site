"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { SimpleSplashView } from "./components/views/simple-splash-view";
import { RegisterCodeView } from "./components/views/register-code-view";
import { GetMetricsByCodeResponse } from "./api/types/get-metrics-by-code";
import { GetTopCodesResponse } from "./api/types/get-top-codes";

function LandingPageContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [metricsData, setMetricsData] =
    useState<GetMetricsByCodeResponse | null>(null);
  const [topCodes, setTopCodes] = useState<GetTopCodesResponse | null>(null);
  const ref = searchParams.get("ref");
  const [registered, setRegistered] = useState(false);
  useEffect(() => {
    // Fetch both metrics and top codes in parallel for better performance
    const fetchMetrics = ref
      ? fetch("/api/get-metrics-by-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: ref }),
        })
          .then(async (response) => {
            if (
              !response.ok ||
              response.status === 404 ||
              response.status === 400
            ) {
              return null;
            }
            const data: GetMetricsByCodeResponse = await response.json();
            return data.success ? data : null;
          })
          .catch(() => null)
      : Promise.resolve(null);

    const fetchTopCodes = fetch("/api/get-top-codes")
      .then(async (response) => {
        if (response.ok) {
          const data: GetTopCodesResponse = await response.json();
          return data;
        }
        return null;
      })
      .catch(() => null);

    // Wait for both requests to complete
    Promise.all([fetchMetrics, fetchTopCodes]).then(([metrics, topCodes]) => {
      if (metrics?.registered) {
        setRegistered(true);
      }
      setTopCodes(topCodes);
      setIsLoading(false);
    });
  }, [ref, registered]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-900 via-blue-950 to-blue-950">
        <div className="text-blue-200">Loading...</div>
      </div>
    );
  }

  return (
    <SimpleSplashView
      topCodes={topCodes}
      registered={registered}
      setRegistered={setRegistered}
      ref={ref || ""}
    />
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
