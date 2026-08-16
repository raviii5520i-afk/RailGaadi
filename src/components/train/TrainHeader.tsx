"use client";

import { Heart, Share2, Train } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/utils/cn";
import { useSearchStore } from "@/store/searchStore";
import type { LiveTrainData } from "@/types/train";

import { showToast } from "@/components/ui/Toast";

interface TrainHeaderProps {
  data: LiveTrainData;
  onShare?: () => void;
  className?: string;
}

export function TrainHeader({ data, onShare, className }: TrainHeaderProps) {
  const { toggleFavourite, isFavourite } = useSearchStore();
  const fav = isFavourite(data.train.number);

  const handleFavourite = () => {
    toggleFavourite(data.train);
    if (!fav) {
      showToast("Saved to Favourites", `${data.train.name} (${data.train.number}) added to your favourites.`, "success");
    } else {
      showToast("Removed from Favourites", `${data.train.name} removed.`, "info");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/journey/${data.train.number}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: data.train.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Link Copied!", "Journey tracking link copied to clipboard.", "success");
        onShare?.();
      }
    } catch {
      await navigator.clipboard.writeText(url);
      showToast("Link Copied!", "Journey tracking link copied to clipboard.", "success");
    }
  };

  return (
    <div
      className={cn(
        "bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-4",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
        {/* Train info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-[#EFF6FF] rounded-md flex items-center justify-center flex-shrink-0">
            <Train className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#6B7280] text-sm font-medium">
                {data.train.number}
              </span>
              <StatusBadge state={data.status.state} size="sm" />
            </div>
            <h1 className="text-[#111318] font-semibold text-lg leading-tight truncate">
              {data.train.name}
            </h1>
            <p className="text-[#9CA3AF] text-xs mt-0.5">
              {data.train.origin.name} → {data.train.destination.name}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleFavourite}
            aria-label={fav ? "Remove from favourites" : "Add to favourites"}
            aria-pressed={fav}
            className={cn(
              "p-2.5 rounded-sm transition-colors duration-micro",
              fav
                ? "text-[#2563EB] bg-[#EFF6FF]"
                : "text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F3F4F6]"
            )}
          >
            <Heart
              className="w-5 h-5"
              fill={fav ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share journey"
            className="p-2.5 rounded-sm text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F3F4F6] transition-colors duration-micro"
          >
            <Share2 className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
