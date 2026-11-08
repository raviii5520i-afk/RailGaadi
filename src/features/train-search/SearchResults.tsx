"use client";

import { Train, ArrowRight, Search } from "lucide-react";
import { SkeletonTrainResult } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";
import type { TrainSearchResult } from "@/types/train";

interface SearchResultsProps {
  results: TrainSearchResult[];
  isLoading: boolean;
  query: string;
  onSelect: (trainNumber: string, trainName: string) => void;
}

export function SearchResults({
  results,
  isLoading,
  query,
  onSelect,
}: SearchResultsProps) {
  return (
    <div className="bg-white rounded-md border border-[#E5E7EB] shadow-modal overflow-hidden">
      {isLoading ? (
        <div className="p-2 space-y-1">
          {[1, 2, 3].map((i) => (
            <SkeletonTrainResult key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <Search className="w-8 h-8 text-[#D1D5DB] mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-[#6B7280]">
            No trains found for &quot;{query}&quot;
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Try a train number like 12951 or a name like &quot;Rajdhani&quot;
          </p>
        </div>
      ) : (
        <ul role="listbox" aria-label="Search results">
          {results.map((train) => (
            <li key={train.trainNumber} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => onSelect(train.trainNumber, train.name)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 text-left",
                  "hover:bg-[#F8F9FB] transition-colors duration-micro",
                  "focus:outline-none focus:bg-[#F8F9FB]",
                  "border-b border-[#F3F4F6] last:border-b-0"
                )}
              >
                {/* Icon */}
                <div className="w-9 h-9 bg-[#EFF6FF] rounded-sm flex items-center justify-center flex-shrink-0">
                  <Train className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#111318]">
                      {train.trainNumber}
                    </span>
                    {train.type && (
                      <span className="text-xs text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded-sm">
                        {train.type}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#6B7280] truncate">{train.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#9CA3AF]">
                    <span className="truncate">{train.origin.name}</span>
                    <ArrowRight className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">{train.destination.name}</span>
                  </div>
                </div>

                {/* Departure time */}
                {train.departureTime && (
                  <span className="text-xs text-[#9CA3AF] flex-shrink-0">
                    {train.departureTime}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
