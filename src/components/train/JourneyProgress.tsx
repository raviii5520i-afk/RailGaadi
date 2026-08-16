"use client";

import { cn, formatNumber } from "@/utils/cn";
import type { JourneyProgress as JourneyProgressType } from "@/types/train";

interface JourneyProgressProps {
  progress: JourneyProgressType;
  className?: string;
}

export function JourneyProgress({ progress, className }: JourneyProgressProps) {
  const { percentage, distanceCoveredKm, distanceRemainingKm, totalDistanceKm } =
    progress;

  return (
    <div
      className={cn(
        "bg-white rounded-md border border-[#E5E7EB] shadow-card p-5",
        className
      )}
      role="region"
      aria-label="Journey progress"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
          Journey Progress
        </p>
        <p
          className="text-2xl font-bold text-[#111318] tabular-nums"
          aria-label={`${percentage} percent complete`}
        >
          {percentage}%
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 bg-[#F3F4F6] rounded-pill overflow-hidden mb-3"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Journey completion"
      >
        <div
          className="h-full bg-[#2563EB] rounded-pill transition-all duration-large"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Distance stats */}
      <div className="flex items-center justify-between text-xs text-[#6B7280]">
        <span className="font-medium text-[#111318]">
          {formatNumber(distanceCoveredKm)} km
          <span className="text-[#9CA3AF] font-normal">
            {" "}
            travelled
          </span>
        </span>
        <span className="text-[#D1D5DB]">·</span>
        <span>
          {formatNumber(distanceRemainingKm)} km remaining
        </span>
      </div>

      {/* Route line visualization */}
      <div className="mt-4 flex items-center gap-0">
        <div className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 h-0.5 bg-[#2563EB]" style={{ maxWidth: `${percentage}%` }} aria-hidden="true" />
        <div
          className="w-2.5 h-2.5 rounded-full bg-[#2563EB] flex-shrink-0 shadow-[0_0_0_3px_rgba(37,99,235,0.2)]"
          aria-hidden="true"
        />
        <div className="flex-1 h-0.5 bg-[#E5E7EB]" aria-hidden="true" />
        <div className="w-2 h-2 rounded-full bg-[#E5E7EB] flex-shrink-0" aria-hidden="true" />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-[#9CA3AF]">
        <span>Origin</span>
        <span>{formatNumber(totalDistanceKm)} km total</span>
        <span>Destination</span>
      </div>
    </div>
  );
}
