"use client";

import { CheckCircle2, Circle, Clock, Train, Navigation2 } from "lucide-react";
import { cn, formatTime } from "@/utils/cn";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { StationSchedule, TrainState } from "@/types/train";

interface StationTimelineProps {
  stations: StationSchedule[];
  currentStationCode?: string;
  trainSpeed?: number;
  trainState?: TrainState;
  delayMinutes?: number;
  className?: string;
}

export function StationTimeline({
  stations,
  currentStationCode,
  trainSpeed,
  trainState = "ON_TIME",
  delayMinutes = 0,
  className,
}: StationTimelineProps) {
  // Find current station index by code or status
  const currentIdx = stations.findIndex(
    (s) =>
      s.status === "current" ||
      (currentStationCode && s.station.code === currentStationCode)
  );

  return (
    <div
      className={cn("bg-white rounded-md border border-[#E5E7EB] shadow-card overflow-hidden", className)}
      role="region"
      aria-label="Live station timeline"
    >
      {/* Timeline Header */}
      <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
            <h2 className="text-sm font-bold text-[#111318]">Station Timeline</h2>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            {stations.filter((s, i) => s.status === "completed" || (currentIdx >= 0 && i < currentIdx)).length} of{" "}
            {stations.length} stations completed
          </p>
        </div>

        <StatusBadge state={trainState} size="sm" />
      </div>

      <ol className="divide-y divide-[#F9FAFB]" aria-label="Stations list">
        {stations.map((station, idx) => {
          const isCompleted =
            station.status === "completed" || (currentIdx >= 0 && idx < currentIdx);
          const isCurrent =
            station.status === "current" ||
            idx === currentIdx ||
            (currentIdx === -1 && idx === 0 && trainState !== "COMPLETED");
          const isLast = idx === stations.length - 1;

          return (
            <StationItem
              key={station.station.id || station.station.code || idx}
              station={station}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isLast={isLast}
              trainSpeed={isCurrent ? trainSpeed : undefined}
              delayMinutes={delayMinutes}
            />
          );
        })}
      </ol>
    </div>
  );
}

function StationItem({
  station,
  isCompleted,
  isCurrent,
  isLast,
  trainSpeed,
  delayMinutes,
}: {
  station: StationSchedule;
  isCompleted: boolean;
  isCurrent: boolean;
  isLast: boolean;
  trainSpeed?: number;
  delayMinutes: number;
}) {
  return (
    <li
      className={cn(
        "flex gap-4 px-5 py-4 transition-colors duration-micro relative",
        isCurrent ? "bg-[#EFF6FF] border-l-4 border-l-[#2563EB]" : "hover:bg-[#F8F9FB]"
      )}
    >
      {/* Vertical Axis Indicator */}
      <div className="flex flex-col items-center flex-shrink-0 pt-0.5 z-10">
        {isCurrent ? (
          <div className="relative flex items-center justify-center">
            {/* Pulsing radar ring behind live train icon */}
            <div className="absolute w-8 h-8 bg-[#2563EB]/20 rounded-full animate-ping" />
            <div className="w-7 h-7 bg-[#2563EB] text-white rounded-full flex items-center justify-center shadow-md shadow-blue-500/40">
              <Train className="w-4 h-4" aria-label="Live Train Position" />
            </div>
          </div>
        ) : isCompleted ? (
          <CheckCircle2
            className="w-5 h-5 text-[#2563EB]"
            aria-label="Completed Station"
          />
        ) : (
          <Circle className="w-5 h-5 text-[#D1D5DB]" aria-label="Upcoming Station" />
        )}

        {!isLast && (
          <div
            className={cn(
              "w-0.5 flex-1 mt-1.5 min-h-[28px]",
              isCompleted ? "bg-[#2563EB]" : "bg-[#E5E7EB]"
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Station Info Content */}
      <div className="flex-1 min-w-0">
        {/* Live Train Location Header Banner */}
        {isCurrent && (
          <div className="mb-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#2563EB] text-white text-[11px] font-semibold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            LIVE TRAIN POSITION
            {trainSpeed !== undefined && trainSpeed > 0 && (
              <>
                <span className="opacity-60">·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Navigation2 className="w-3 h-3 text-white" />
                  {trainSpeed} km/h
                </span>
              </>
            )}
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p
                className={cn(
                  "font-bold text-sm leading-tight",
                  isCurrent ? "text-[#2563EB]" : isCompleted ? "text-[#111318]" : "text-[#6B7280]"
                )}
              >
                {station.station.name}
              </p>

              {/* Platform number badge if available */}
              {station.platform && (
                <span className="text-[10px] font-semibold bg-[#F3F4F6] text-[#6B7280] px-1.5 py-0.5 rounded-sm">
                  PF {station.platform}
                </span>
              )}
            </div>

            <p className="text-[#9CA3AF] text-xs font-mono mt-0.5">{station.station.code}</p>
          </div>

          {/* Distance from origin */}
          {station.distanceFromOriginKm !== undefined && (
            <p className="text-xs text-[#9CA3AF] font-mono flex-shrink-0">
              {station.distanceFromOriginKm.toLocaleString("en-IN")} km
            </p>
          )}
        </div>

        {/* Timings row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          {/* Scheduled Departure / Arrival */}
          {(station.scheduledDeparture || station.scheduledArrival) && (
            <div className="flex items-center gap-1.5 text-[#6B7280]">
              <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" aria-hidden="true" />
              <span>Sch: {formatScheduleTime(station.scheduledArrival || station.scheduledDeparture)}</span>
            </div>
          )}

          {/* Actual Arrival / Departure */}
          {(station.actualArrival || station.actualDeparture) && (
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-[#9CA3AF]">Act:</span>
              <span className={delayMinutes > 5 ? "text-amber-600 font-semibold" : "text-green-600 font-semibold"}>
                {formatScheduleTime(station.actualArrival || station.actualDeparture)}
              </span>
              {delayMinutes > 0 && (
                <span className="text-amber-600 font-semibold">
                  (+{delayMinutes}m)
                </span>
              )}
            </div>
          )}

          {/* Halt duration */}
          {station.haltDurationMinutes !== undefined && station.haltDurationMinutes > 0 && (
            <span className="text-[#9CA3AF]">
              Halt: {station.haltDurationMinutes} min
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function formatScheduleTime(val?: string): string {
  if (!val) return "—";
  if (val.includes("T")) return formatTime(val);
  return val; // e.g. "17:00"
}
