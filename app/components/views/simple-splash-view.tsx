"use client";

import { useState } from "react";
import { GetTopCodesResponse } from "../../api/types/get-top-codes";
import { MainContent } from "../metrics-content";

interface SimpleSplashViewProps {
  topCodes?: GetTopCodesResponse | null;
  registered: boolean;
  ref: string;
  setRegistered: (registered: boolean) => void;
}

export function SimpleSplashView({
  topCodes,
  registered,
  ref,
  setRegistered,
}: SimpleSplashViewProps) {
  const isLoading = topCodes === undefined;
  const isSuccess = topCodes?.success === true;

  const handleKickstarterClick = () => {
    const baseUrl =
      "https://www.kickstarter.com/projects/noonesark/no-ones-ark-the-most-biblical-campaign-ever";
    const kickstarterUrl = `${baseUrl}?ref=${encodeURIComponent("eef4cb")}`;
    window.open(kickstarterUrl, "_blank");
  };

  return (
    <div className="h-screen w-screen">
      {/* Main content */}
      <MainContent
        registered={registered}
        ref={ref}
        setRegistered={setRegistered}
      />
    </div>
  );
}
