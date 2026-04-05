import { Monitor } from "lucide-react";

type AdSize = "banner" | "sidebar" | "leaderboard";

interface AdSlotProps {
  size: AdSize;
  className?: string;
}

const sizeConfig: Record<AdSize, { width: string; height: string; label: string }> = {
  banner: { width: "w-full", height: "h-24", label: "Banner Ad" },
  sidebar: { width: "w-full", height: "h-64", label: "Sidebar Ad" },
  leaderboard: { width: "w-full", height: "h-20", label: "Leaderboard Ad" },
};

export function AdSlot({ size, className = "" }: AdSlotProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={`ad-container ${config.width} ${config.height} flex flex-col items-center justify-center gap-2 rounded-xl border border-[#00f0ff]/10 bg-[#0a0f1c]/50 backdrop-blur-sm ${className}`}
    >
      <Monitor className="h-5 w-5 text-[#00f0ff]/30" />
      <span className="font-mono text-xs text-[#00f0ff]/25">
        [ {config.label} ]
      </span>
    </div>
  );
}
