"use client";

import { MapPin, ArrowRight, Clock, AlertCircle } from "lucide-react";
import { DelayBadge } from "@/components/ui/StatusBadge";
import { formatTime, formatDelay, isStale } from "@/utils/cn";
import { cn } from "@/utils/cn";
import type { LiveTrainData } from "@/types/train";

interface TrainStatusCardProps {
  data: LiveTrainData;
  className?: string;
}

export function TrainStatusCard({ data, className }: TrainStatusCardProps) {
  const { status, progress } = data;
  const stale = isStale(status.lastUpdated);

  return (
    <div
      className={cn(
        "bg-white rounded-md border border-[#E5E7EB] shadow-card p-5 space-y-4",
        className
      )}
      role="region"
      aria-label="Live train status"
    >
      {/* Stale data warning */}
      {stale && (
        <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 border border-amber-200 rounded-sm px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          Live data may be delayed. Showing last known status.
        </div>
      )}

      {/* Current → Next */}
      <div className="flex items-start gap-3">
        {/* Current Station */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-1">
            Currently at
          </p>
          <div className="flex items-start gap-1.5">
            <MapPin
              className="w-4 h-4 text-[#2563EB] mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <p className="text-[#111318] font-semibold text-base leading-tight">
              {status.currentStation?.name ?? "—"}
            </p>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1 ml-5">
            {status.currentStation?.code}
          </p>
        </div>

        <ArrowRight
          className="w-4 h-4 text-[#D1D5DB] mt-6 flex-shrink-0"
          aria-hidden="true"
        />

        {/* Next Station */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-1">
            Next
          </p>
          <p className="text-[#111318] font-semibold text-base leading-tight">
            {status.nextStation?.name ?? "—"}
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1">
            {status.nextStation?.code}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#F3F4F6]" />

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-[#9CA3AF] mb-1">Delay</p>
          {status.delayMinutes === 0 ? (
            <span className="text-sm font-semibold text-green-600">On Time</span>
          ) : (
            <DelayBadge minutes={status.delayMinutes} />
          )}
        </div>

        <div>
          <p className="text-xs text-[#9CA3AF] mb-1">Progress</p>
          <p className="text-sm font-semibold text-[#111318]">
            {progress.percentage}%
          </p>
        </div>

        <div>
          <p className="text-xs text-[#9CA3AF] mb-1">Remaining</p>
          <p className="text-sm font-semibold text-[#111318]">
            {progress.distanceRemainingKm.toLocaleString("en-IN")} km
          </p>
        </div>
      </div>

      {/* Last Updated */}
      <LastUpdated timestamp={status.lastUpdated} stale={stale} />
    </div>
  );
}

function LastUpdated({
  timestamp,
  stale,
}: {
  timestamp: string;
  stale: boolean;
}) {
  const relTime = formatRelativeTime(timestamp);
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs",
        stale ? "text-amber-500" : "text-[#9CA3AF]"
      )}
      aria-live="polite"
      aria-label={`Data last updated ${relTime}`}
    >
      <Clock className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
      Updated {relTime}
    </div>
  );
}

function formatRelativeTime(timestamp: string): string {
  const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}
