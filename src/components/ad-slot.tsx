"use client";

import { Monitor } from "lucide-react";

type AdSize = "banner" | "sidebar" | "leaderboard";

interface AdSlotProps {
  size: AdSize;
  className?: string;
}

const sizeConfig: Record<AdSize, { height: string; adFormat: string; adSlot: string }> = {
  banner: { height: "min-h-[100px]", adFormat: "auto", adSlot: "BANNER_SLOT_ID" },
  sidebar: { height: "min-h-[250px]", adFormat: "auto", adSlot: "SIDEBAR_SLOT_ID" },
  leaderboard: { height: "min-h-[90px]", adFormat: "horizontal", adSlot: "LEADERBOARD_SLOT_ID" },
};

// Set to true and fill in your AdSense publisher ID + slot IDs to enable real ads
const ADSENSE_ENABLED = false;
const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX";

export function AdSlot({ size, className = "" }: AdSlotProps) {
  const config = sizeConfig[size];

  if (ADSENSE_ENABLED) {
    return (
      <div className={`w-full ${config.height} ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={config.adSlot}
          data-ad-format={config.adFormat}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Placeholder mode
  return (
    <div
      className={`ad-container w-full ${config.height} flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#00f0ff]/8 bg-[#0a0f1c]/30 ${className}`}
    >
      <Monitor className="h-4 w-4 text-[#00f0ff]/15" />
      <span className="font-mono text-[10px] text-[#00f0ff]/15 uppercase tracking-widest">
        Sponsored
      </span>
    </div>
  );
}
