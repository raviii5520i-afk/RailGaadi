"use client";

import { Clock, X } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { cn } from "@/utils/cn";

interface RecentSearchesProps {
  onSelect: (trainNumber: string, trainName: string) => void;
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const { recentSearches, removeRecentSearch, clearRecentSearches } =
    useSearchStore();

  if (recentSearches.length === 0) return null;

  return (
    <section aria-label="Recent searches">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[#111318]">Recent</h2>
        <button
          type="button"
          onClick={clearRecentSearches}
          className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors duration-micro"
          aria-label="Clear all recent searches"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-1.5">
        {recentSearches.map((search) => (
          <div
            key={search.trainNumber}
            className="flex items-center gap-3 group"
          >
            <button
              type="button"
              onClick={() => onSelect(search.trainNumber, search.trainName)}
              className={cn(
                "flex-1 flex items-center gap-3 px-3.5 py-3 bg-white rounded-md",
                "border border-[#E5E7EB] text-left",
                "hover:border-[#D1D5DB] hover:shadow-card-hover transition-all duration-micro"
              )}
              aria-label={`Open ${search.trainName}`}
            >
              <Clock
                className="w-4 h-4 text-[#D1D5DB] flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-[#111318]">
                  {search.trainNumber}
                </span>
                <span className="text-sm text-[#6B7280] ml-2">
                  {search.trainName}
                </span>
              </div>
              <span className="text-xs text-[#9CA3AF] flex-shrink-0">
                {formatRelativeTime(search.lastViewed)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => removeRecentSearch(search.trainNumber)}
              aria-label={`Remove ${search.trainName} from recent searches`}
              className={cn(
                "p-1.5 rounded-sm text-[#D1D5DB] hover:text-[#9CA3AF]",
                "opacity-0 group-hover:opacity-100 transition-all duration-micro"
              )}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatRelativeTime(timestamp: string): string {
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
