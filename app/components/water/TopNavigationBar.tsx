// components/water/TopNavigationBar.tsx
"use client";

import { OwnerBanner } from "./OwnerBanner";
import { RefererStats } from "../../api/types/referrer-dynamo";

type TopNavigationBarProps = {
  record?: RefererStats | null | undefined;
  registered?: boolean;
};

export function TopNavigationBar({
  record,
  registered = false,
}: TopNavigationBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="flex items-start justify-center pt-4 px-[60px]">
        {/* Center: Owner Banner - stretches between bubble menu and logo */}
        <div className="flex justify-center pointer-events-auto w-full max-w-[calc(100vw-120px)]">
          <OwnerBanner record={record} registered={registered} />
        </div>
      </div>
    </div>
  );
}
